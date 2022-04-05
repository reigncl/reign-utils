import { mechanicExpressions, TypePart } from "./mechanicsExpressions";
import { MechanicsId, MechanicsIdSupported, MechanicsMapExpression } from "./MechanicsIdSupported";


export interface Path {
  type: TypePart
  value: string
}


export class Mechanics<A extends MechanicsId>{
  parts: { type: string; value: string }[] = [];

  constructor(mechanicsId: A, mechanicsText: MechanicsMapExpression[A]) {
    this.parts = Mechanics.parseToParts(mechanicsId, mechanicsText);
  }

  formatToParts() {
    return this.parts;
  }

  format() {
    return this.parts.map((e) => e.value).join("");
  }

  static currencyFormat = new Intl.NumberFormat("es-CL", {
    currency: "CLP",
    style: "currency",
  });

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

  static parseToParts(mechanicsId: any, mechanicsText: any): Path[] {
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
        const parts = exp.parts.map(({ type, value }) => {
          if (typeof value === "string") {
            return { type, value };
          }

          if (typeof value === "function") {
            return {
              type: type,
              value: value(group, { currencyFormat: Mechanics.currencyFormat })
            }
          }

          throw new Error(`The value field is not type supported`);
        });

        return parts;
      }
    }

    throw new Error(`Cannot find the expression for the mechanic id ${mechanicsId}`);
  }
}

