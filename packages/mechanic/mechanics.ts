import { mechanicExpressions } from "./mechanics-expressions";
import { Template } from "./Template";
import { Path } from "./Path";


export type MechanicsOption = {
  style?: string
  currencyFormat?: Intl.NumberFormatOptions
}


export class Mechanics {
  private currencyFormatOptions: Intl.NumberFormatOptions;
  private currencyFormat: Intl.NumberFormat;
  private style: string;

  constructor(readonly locales: string | string[] = ['es-CL'], readonly options?: MechanicsOption) {
    this.style = this.options?.style ?? "default";
    this.currencyFormatOptions = {
      currency: "CLP",
      style: "currency",
      ...this.options?.currencyFormat,
    };
    this.currencyFormat = new Intl.NumberFormat(locales, this.currencyFormatOptions);
  }

  formatToParts(mechanicsId: string, mechanicsText: string): Path[] {
    const styledMechanicExpressions = mechanicExpressions[this.style];

    if (!styledMechanicExpressions) {
      throw new Error(`Mechanics style ${this.style} is not supported`);
    }

    const mechanicExpression = styledMechanicExpressions[mechanicsId];

    if (!mechanicExpression) {
      throw new Error(`MechanicsId ${mechanicsId} is not supported`);
    }

    const expressions = Array.isArray(mechanicExpression) ? mechanicExpression : [mechanicExpression];

    for (const exp of expressions) {
      const resultExp = exp.exp.exec(mechanicsText);
      if (resultExp) {
        const group = resultExp.groups ?? {};
        return exp.template.renderParts(group, { currencyFormat: this.currencyFormat, locales: this.locales });
      }
    }

    throw new Error(`Cannot find the expression for the mechanic id ${mechanicsId}`);
  }

  format(mechanicsId: string, mechanicsText: string): string {
    return this.formatToParts(mechanicsId, mechanicsText).map(part => part.value).join('');
  }
}

