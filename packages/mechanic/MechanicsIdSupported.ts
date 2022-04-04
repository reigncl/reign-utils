export const MechanicsIdSupported = [
    "1",
    "2",
    "4",
    "7",
    "13",
    "11",
] as const;


export type MechanicsId = typeof MechanicsIdSupported[number];


export interface MechanicsMapExpression {
    "1": `${number}`
    "4": `${number}*${number}`
    "13": string
    "11": `${number}*${number}`
    "2": `${number}*${number}`
    "7": `${number}*${number}`
}

// +7
// +2
