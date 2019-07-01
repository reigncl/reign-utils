// tslint:disable:max-line-length
import { compile, Options, TemplateFunction, Data } from 'ejs';
import { readFileSync } from 'fs';
import { promisify } from 'util';
import request = require('request');
import xpath from 'xpath';
import { DOMParser } from 'xmldom';

export function declareTemplate<O extends Data>(templatePath: string, compileOption?: Options) {
  return { templatePath, compileOption, type: {} as O };
}

type TemplatesList = {
  [templateName: string]: ReturnType<typeof declareTemplate>;
};

type TemplatesOptions<T extends TemplatesList> = {
  templates: T;
  compileOption?: Options;
};

async function loadTemplateBody(inTemplatePath: string): Promise<{ title?: string, template: string }> {
  const isHttps = /^https\:\/\//i.test(inTemplatePath);
  const isHttp = /^http\:\/\//i.test(inTemplatePath);
  const isWithoutSchema = /^\/\//i.test(inTemplatePath);

  const templatePath = isWithoutSchema ? `https:${inTemplatePath}` : inTemplatePath;

  if (isHttp || isHttps || isWithoutSchema) {
    const res = await promisify<string, request.Response>(request.get)(templatePath);

    if (res.headers['content-type'] === 'application/vnd.contentful.delivery.v1+json') {
      const entry = JSON.parse(res.body);
      return {
        title: entry.fields.name
          ? entry.fields.name
          : entry.fields.title
            ? entry.fields.title
            : entry.fields.id
              ? entry.fields.id
              : undefined,
        template: entry.fields.template,
      };
    }

    return {
      template: res.body,
    };
  }

  const dataFile = readFileSync(templatePath, 'utf8');
  let title: string | undefined;

  if (dataFile.includes('<!DOCTYPE html>')) {
    const doc = new DOMParser({ errorHandler: { warning: undefined } }).parseFromString(dataFile);
    title = xpath.select('//head/title/node()', doc, true).toString();
  }

  return {
    title,
    template: dataFile,
  };
}

const createTemplateFunction = async (templateDeclaration: ReturnType<typeof declareTemplate>, compileOption: Options) => {
  const templateBody = await loadTemplateBody(templateDeclaration.templatePath);

  return Object.assign(
    compile(templateBody.template, {
      ...compileOption,
      ...templateDeclaration.compileOption,
      async: false,
    }),
    {
      title: templateBody.title,
    },
  );
};

export class Templates<templatesList extends TemplatesList> {
  readonly templateFunctions: {
    [templateName: string]: Promise<TemplateFunction>;
  } = {};

  constructor({ templates, compileOption = {} }: TemplatesOptions<templatesList>) {
    Object.entries(templates)
      .forEach(([templateName, templateDeclaration]) => {
        this.templateFunctions[templateName] = createTemplateFunction(templateDeclaration, compileOption);
      });
  }

  async render<templateKey extends keyof templatesList>(templateName: templateKey, data: templatesList[templateKey]['type']) {
    const templateFunction = await this.templateFunctions[templateName as string];
    return templateFunction(data);
  }
}
