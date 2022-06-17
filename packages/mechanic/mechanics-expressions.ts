import { Part } from "./Part";
import { template, Template } from "./Template";
export interface Expressions {
  exp: RegExp
  template: Template
}

export const discount = new Part("discount", ({ discount }) => [{ type: "discount", value: discount }, { type: "percentSign", value: `%` }]);
export const offer = new Part("offer", ({ offer }, { currencyFormat }) => currencyFormat.formatToParts(Number(offer)))
export const ref = new Part("ref", ({ ref }, { currencyFormat }) => currencyFormat.formatToParts(Number(ref)))
export const input = new Part("input", ({ input }) => input)
export const nProducts = new Part("nProducts", ({ nProducts }) => nProducts)
export const m = new Part("m", ({ m }) => m)
export const newLine = new Part("new_line", () => `\n`)
export const nOffer = new Part("nOffer", ({ nOffer }, { currencyFormat }) => currencyFormat.formatToParts(Number(nOffer)))
export const discountAmount = new Part("discountAmount", ({ discountAmount }, { currencyFormat }) => currencyFormat.formatToParts(Number(discountAmount)))
export const minimumAmount = new Part("minimumAmount", ({ minimumAmount }, { currencyFormat }) => currencyFormat.formatToParts(Number(minimumAmount)))
const amountSuffix = new Part( "amountSuffix", ({amountSuffix}, {ordinalNumbers}) => ordinalNumbers.formatToParts(amountSuffix))
const price = new Part("price", ({ price }, { currencyFormat }) => currencyFormat.formatToParts(Number(price)))

type MechanicId = string
type StyleId = string
type MechanicTemplates = Record<MechanicId, Expressions | Expressions[]>
type StylesMechanicTemplates = Record<StyleId, MechanicTemplates>

const defaultMechanicExpressions: MechanicTemplates = {
  "1": {
    exp: /^(?<discount>\d+)$/,
    template: template`${discount} Descuento`,
  },
  "2": {
    exp: /^(?<nProducts>\d+)\*(?<m>\d+)$/,
    template: template`${nProducts}x${m}`,
  },
  "4": [
    {
      exp: /^(?<offer>\d+)$/,
      template: template`${offer}`,
    },
    {
      exp: /^(?<offer>\d+)\*(?<ref>\d+)$/,
      template: template`${offer} Antes: ${ref}`,
    },
  ],
  "7": {
    exp: /^(?<nProducts>\d+)\*(?<offer>\d+)$/,
    template: template`${nProducts} x ${offer}`,
  },
  "11": {
    exp: /^(?<discountAmount>\d+)\*(?<minimumAmount>\d+)$/,
    template: template`${discountAmount} Por una compra sobre ${minimumAmount}`,
  },
  "13": {
    exp: /^(?<input>.+)$/,
    template: template`${input}`,
  },
};

export const mechanicExpressions: StylesMechanicTemplates = {
  default: defaultMechanicExpressions,
  "mobile-alvi": {
    ...defaultMechanicExpressions,
    "11": {
      exp: /^(?<discountAmount>\d+)\*(?<minimumAmount>\d+)$/,
      template: template`${discountAmount} de descuento${newLine}Por compras sobre ${minimumAmount}`,
    },
  },
  "mobile-unimarc": {
    ...defaultMechanicExpressions,
    "4": [
      {
        exp: /^(?<offer>\d+)$/,
        template: template`${offer}`,
      },
      {
        exp: /^(?<offer>\d+)\*(?<ref>\d+)$/,
        template: template`${offer}${newLine}Antes: ${ref}`,
      },
    ],
    "8": [
      {
        exp: /^(?<amountSuffix>\d+)\*(?<discount>\d{1,2})$/,
        template: template`${discount} en ${amountSuffix} un`,
      },
      {
        exp: /^(?<amountSuffix>\d+)\*(?<price>\d{3,})$/,
        template: template`${amountSuffix} un x ${price}`,
      }
    ],
    "11": {
      exp: /^(?<discountAmount>\d+)\*(?<minimumAmount>\d+)$/,
      template: template`${discountAmount} de descuento${newLine}Por compras sobre ${minimumAmount}`,
    }
  }
}; 
