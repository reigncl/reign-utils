const { inspect } = require('util');

module.exports = class BaseError extends Error {
  constructor(status, code, _description, metadata) {
    if (!status) {
      throw new Error('error status is required');
    }

    if (!_description) {
      throw new Error('error description is required');
    }
    let description;
    if (typeof _description === 'function') description = _description(metadata);
    else description = _description;

    super(description);
    this.code = code;
    this.status = status;
    this.description = description;
    this.metadata = metadata || {};
  }

  toString() {
    return `[${this.code}] ${this.message} - metadata: ${inspect(this.metadata)}`;
  }
};
