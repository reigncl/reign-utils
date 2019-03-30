export default class BaseError extends Error {
    code: number;
    status: number;
    description: string;
    metadata: any;
    printStack: any;
    constructor(status: number, code: number, _description: (arg0: any) => string, metadata: {});
    static setPrintStack(value: boolean): void;
    setPrintStack(value: any): void;
    toString(): string;
    toJSON(): {
        code: number;
        status: number;
        description: string;
        metadata: any;
        stack: string | undefined;
    };
}
