import { mechanicExpressions, Path, Template } from "./mechanics-expressions";
import { MechanicsId, MechanicsIdSupported, MechanicsMapExpression } from "./mechanics-id-supported";


export type MechanicsOption = {
  style?: string
  locales?: string | string[]
  currencyFormat?: Intl.NumberFormatOptions
}


export class Mechanics<A extends MechanicsId>{
  parts: { type: string; value: string }[] = [];

  constructor(mechanicsId: A, mechanicsText: MechanicsMapExpression[A], options?: MechanicsOption) {
    this.parts = Mechanics.parseToParts(mechanicsId, mechanicsText, options);
  }

  formatToParts() {
    return this.parts;
  }

  format() {
    return this.parts.map((e) => e.value).join("");
  }

  static isValidMechanicsId(mechanicsId: any): mechanicsId is MechanicsId {
    const mechanicsIdVal = ["number", "string"].includes(typeof mechanicsId) ? mechanicsId.toString() : "";
    return MechanicsIdSupported.includes(mechanicsIdVal);
  }

  static isValidMechanics(mechanicsId: MechanicsId, mechanicsText: any): mechanicsText is MechanicsMapExpression[typeof mechanicsId] {
    const mechanicExpression = mechanicExpressions[mechanicsId];
    const expressions = Array.isArray(mechanicExpression) ? mechanicExpression : [mechanicExpression];

    for (const expression of expressions) {
      if (expression.exp.test(mechanicsText)) {
        return true;
      }
    }

    return false
  }

  static expressions = mechanicExpressions;

  static getStyle(mechanicsId: MechanicsId) {
    const mechanicExpression = mechanicExpressions[mechanicsId];
    const expressions = Array.isArray(mechanicExpression) ? mechanicExpression : [mechanicExpression];
    return expressions;
  }

  static defineStyle(mechanicsId: MechanicsId, expressionPos: number | null | undefined, styleName: string, parts: Template) {
    const expressionPosition = expressionPos ?? 0;
    const mechanicExpression = mechanicExpressions[mechanicsId];
    const expressions = Array.isArray(mechanicExpression) ? mechanicExpression : [mechanicExpression];
    const expression = expressions[expressionPosition];

    const nextParts = expression.parts instanceof Template ? { default: expression.parts } : expression.parts;

    nextParts[styleName] = parts;

    expression.parts = nextParts;
  }

  static parseToParts(mechanicsId: any, mechanicsText: any, options?: MechanicsOption): Path[] {
    const style = options?.style ?? "default";
    const locales = options?.locales ?? ["es-CL"];
    const currencyFormatOptions: Intl.NumberFormatOptions = {
      currency: "CLP",
      style: "currency",
      ...options?.currencyFormat,
    };

    const currencyFormat = new Intl.NumberFormat(locales, currencyFormatOptions);

    if (!Mechanics.isValidMechanicsId(mechanicsId)) {
      throw new Error(`MechanicsId ${mechanicsId} is not supported`);
    }

    if (!Mechanics.isValidMechanics(mechanicsId, mechanicsText)) {
      throw new Error(`Mechanics ${mechanicsText} is not supported`);
    }

    const mechanicExpression = mechanicExpressions[mechanicsId];

    const expressions = Array.isArray(mechanicExpression) ? mechanicExpression : [mechanicExpression];

    for (const exp of expressions) {
      const resultExp = exp.exp.exec(mechanicsText);
      if (resultExp) {
        const group = resultExp.groups ?? {};

        const partsCompose = exp.parts instanceof Template ? exp.parts : exp.parts[style] ?? exp.parts.default;

        if (!partsCompose) {
          throw new Error(`Not found parts for ${mechanicsId}`);
        }

        return partsCompose.renderParts(group, { currencyFormat, locales });
      }
    }

    throw new Error(`Cannot find the expression for the mechanic id ${mechanicsId}`);
  }
}

