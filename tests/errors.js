const { expect } = require('chai');
const { BaseError } = require('..');

describe('Errors', () => {
  it('status is required', (done) => {
    expect(() => {
      new BaseError(); // eslint-disable-line
    }).to.throw();
    done();
  });

  it('description is required', (done) => {
    expect(() => {
      new BaseError(200); // eslint-disable-line
    }).to.throw();
    done();
  });

  it('toString should show description', (done) => {
    const err = new BaseError(200, 'CODE', 'fakeDescription');
    expect(err.toString()).to.have.string('fakeDescription');
    done();
  });

  it('error.setPrintStack() should ytoggle toJSON print Stack', () => {
    const err = new BaseError(200, 'CODE', 'fakeDescription');
    const err2 = new BaseError(202, 'CODE2', 'fakeDescription2');
    err2.setPrintStack(true);
    expect(err.toJson().stack).to.be.undefined;
    expect(err2.toJson().stack).not.to.be.undefined;
    err.setPrintStack(true);
    err2.setPrintStack(false);
    expect(err.toJson().stack).not.to.be.undefined;
    expect(err2.toJson().stack).to.be.undefined;
  });

  it('BaseError.setPrintStack() should toggle the stack definition', () => {
    BaseError.setPrintStack(true);
    const err = new BaseError(200, 'CODE', 'fakeDescription');
    const err2 = new BaseError(202, 'CODE2', 'fakeDescription2');
    expect(err.toJson().stack).not.to.be.undefined;
    expect(err2.toJson().stack).not.to.be.undefined;
    BaseError.setPrintStack(false);
    expect(err.toJson().stack).to.be.undefined;
    expect(err2.toJson().stack).to.be.undefined;
  });
});
