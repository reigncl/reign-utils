import { MechanicsId } from "./mechanics-id-supported"


export interface Path {
  type: TypePart;
  value: string;
}

export interface FormatOptions {
  currencyFormat: Intl.NumberFormat
  locales: string[] | string
}

export class Part {
  constructor(
    readonly type: TypePart,
    private value: string | ((group: Record<string, string>, options: FormatOptions) => string)
  ) { }

  render(group: Record<string, string>, options: FormatOptions) {
    if (typeof this.value === "string") {
      return this.value;
    }
    return this.value(group, options);
  }
}

export class Template {
  constructor(
    private template: { raw: readonly string[] | ArrayLike<string> },
    private substitutions: Part[],
  ) { }

  renderParts(group: Record<string, string>, options: FormatOptions): Path[] {
    const parts: Path[] = [];
    const len = Math.max(this.template.raw.length, this.substitutions.length);
    for (let i = 0; i < len; i++) {
      parts.push({ type: "literal", value: this.template.raw[i] });
      const substitution = this.substitutions[i];
      if (substitution) {
        parts.push({ type: substitution.type, value: substitution.render(group, options) });
      }
    };
    return parts;
  }

  render(group: Record<string, string>, options: FormatOptions) {
    return String.raw(
      this.template,
      ...this.substitutions.map(part => part.render(group, options))
    )
  }
}

export const part = (
  type: TypePart,
  value: string | ((group: Record<string, string>, options: FormatOptions) => string)
) => new Part(type, value);

export const template = (
  template: { raw: readonly string[] | ArrayLike<string> },
  ...substitutions: Part[]
) => new Template(template, substitutions);

export enum Styles { default }

export type TypePart =
  | "discount"
  | "discountAmount"
  | "literal"
  | "m"
  | "minimumAmount"
  | "nProducts"
  | "offer"
  | "ref"
  | "input"
  | "nOffer"

export interface Expressions {
  exp: RegExp
  parts: Template | {
    /** !use style `default` to omit error.  */
    [style: string]: Template;
  }
}

export const discount = new Part("discount", ({ discount }) => `${discount}%`)
export const offer = new Part("offer", ({ offer }, { currencyFormat }) => `${currencyFormat.format(Number(offer))}`)
export const ref = new Part("ref", ({ ref }, { currencyFormat }) => currencyFormat.format(Number(ref)))
export const input = new Part("input", ({ input }) => input)
export const nProducts = new Part("nProducts", ({ nProducts }) => nProducts)
export const m = new Part("m", ({ m }) => m)
export const nOffer = new Part("nOffer", ({ nOffer }, { currencyFormat }) => currencyFormat.format(Number(nOffer)))
export const discountAmount = new Part("discountAmount", ({ discountAmount }, { currencyFormat }) => currencyFormat.format(Number(discountAmount)))
export const minimumAmount = new Part("minimumAmount", ({ minimumAmount }, { currencyFormat }) => currencyFormat.format(Number(minimumAmount)))

export const mechanicExpressions: { [id in MechanicsId]: Expressions | Expressions[] } = {
  "1": {
    exp: /^(?<discount>\d+)$/,
    parts: template`${discount} Descuento`,
  },
  "4": [
    {
      exp: /^(?<offer>\d+)$/,
      parts: template`${offer}`,
    },
    {
      exp: /^(?<offer>\d+)\*(?<ref>\d+)$/,
      parts: template`${offer} Antes: ${ref}`,
    },
  ],
  "13": {
    exp: /^(?<input>.+)$/,
    parts: template`${input}`,
  },
  "11": {
    exp: /^(?<discountAmount>\d+)\*(?<minimumAmount>\d+)$/,
    parts: template`${discountAmount} Por una compra sobre ${minimumAmount}`,
  },
  "2": {
    exp: /^(?<nProducts>\d+)\*(?<m>\d+)$/,
    parts: template`${nProducts}x${m}`,
  },
  "7": {
    exp: /^(?<nProducts>\d+)\*(?<offer>\d+)$/,
    parts: {
      default: template`${nProducts} x ${offer}`,
    }
  },
};
