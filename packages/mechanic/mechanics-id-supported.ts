export const MechanicsIdSupported = [
    "1",
    "2",
    "4",
    "7",
    "8",
    "11",
    "13",
] as const;

export type MechanicsId = typeof MechanicsIdSupported[number];
export interface MechanicsMapExpression {
    "1": `${number}`
    "2": `${number}*${number}`
    "4": `${number}` | `${number}*${number}`
    "7": `${number}*${number}`
    "8": `${number}*${number}`
    "11": `${number}*${number}`
    "13": string
}