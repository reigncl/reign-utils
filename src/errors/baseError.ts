import { inspect } from 'util';

let globalPrintStack = false;

export default class BaseError extends Error {
  code: number;
  status: number;
  description: string;
  metadata: any;
  printStack: any;

  constructor(status: number, code: number, _description: (arg0: any) => string, metadata: {}) {
    if (!status) {
      throw new Error('error status is required');
    }

    if (!_description) {
      throw new Error('error description is required');
    }
    let description: string;
    if (typeof _description === 'function') description = _description(metadata);
    else description = _description;

    super(description);
    this.code = code;
    this.status = status;
    this.description = description;
    this.metadata = metadata || {};
  }

  static setPrintStack(value: boolean) {
    globalPrintStack = value;
  }

  setPrintStack(value: any) {
    this.printStack = value;
  }

  toString() {
    return `[${this.code}] ${this.message} - metadata: ${inspect(this.metadata)}`;
  }

  toJSON() {
    const jsonError = {
      code: this.code,
      status: this.status,
      description: this.description,
      metadata: <any> null,
      stack: <Error['stack']> <unknown> null,
    }

    if (this.metadata) { jsonError.metadata = this.metadata; }

    if ((this.printStack === undefined && globalPrintStack) || (this.printStack !== undefined && this.printStack)) {
      jsonError.stack = this.stack;
    }

    return jsonError;
  }
};
