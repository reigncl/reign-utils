import { OrdinalNumbers } from "./OrdinalNumbers";

export interface FormatOptions {
  currencyFormat: Intl.NumberFormat;
  locales: string[] | string;
  ordinalNumbers: OrdinalNumbers
}
