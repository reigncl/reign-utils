import { MechanicsId } from "./MechanicsIdSupported"



export interface ExpressionsPart {
  type: string
  value:
  | string
  | ((group: Record<string, string>, formats: { currencyFormat: Intl.NumberFormat }) => string)
}

export interface Expressions {
  exp: RegExp
  parts: ExpressionsPart[]
}



export const mechanicExpressions: { [id in MechanicsId]: Expressions | Expressions[] } = {
  "1": {
    exp: /^(?<discount>\d+)$/,
    parts: [
      { type: "discount", value: ({ discount }) => `${discount}%` },
      { type: "literal", value: ` Descuento` },
    ]
  },
  "4": [
    {
      exp: /^(?<offer>\d+)$/,
      parts: [
        { type: "offer", value: ({ offer }, { currencyFormat }) => `${currencyFormat.format(Number(offer))}` },
      ]
    },
    {
      exp: /^(?<offer>\d+)\*(?<ref>\d+)$/,
      parts: [
        { type: "offer", value: ({ offer }, { currencyFormat }) => `${currencyFormat.format(Number(offer))}` },
        { type: "literal", value: " Antes: " },
        { type: "ref", value: ({ ref }, { currencyFormat }) => currencyFormat.format(Number(ref)) },
      ]
    },
  ],
  "13": {
    exp: /^(?<mechanics>.+)$/,
    parts: [
      { type: "literal", value: ({ mechanics }) => mechanics },
    ],
  },
  "11": {
    exp: /^(?<discountAmount>\d+)\*(?<minimumAmount>\d+)$/,
    parts: [
      { type: "discountAmount", value: ({ discountAmount }, { currencyFormat }) => currencyFormat.format(Number(discountAmount)) },
      { type: "literal", value: " Por una compra sobre " },
      { type: "minimumAmount", value: ({ minimumAmount }, { currencyFormat }) => currencyFormat.format(Number(minimumAmount)) },
    ]
  },
  "2": {
    exp: /^(?<nProducts>\d+)\*(?<m>\d+)$/,
    parts: [
      { type: "nProducts", value: ({ nProducts }) => nProducts },
      { type: "literal", value: "x" },
      { type: "m", value: ({ m }) => m },
    ]
  },
  "7": {
    exp: /^(?<nProducts>\d+)\*(?<nOffer>\d+)$/,
    parts: [
      { type: "nProducts", value: ({ nProducts }) => nProducts },
      { type: "literal", value: " x " },
      { type: "m", value: ({ nOffer }, { currencyFormat }) => currencyFormat.format(Number(nOffer)) },
    ]
  },
};
