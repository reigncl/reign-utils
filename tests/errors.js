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
});
