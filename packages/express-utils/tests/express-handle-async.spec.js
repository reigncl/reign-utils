const {
  requestHandlerAsync,
  errorRequestHandlerAsync,
  requestParamHandlerAsync,
} = require('../utils/express-handle-async');

describe('requestHandlerAsync()', () => {
  it('success request', (done) => {
    const wrap = requestHandlerAsync(async (req, res) => {
      res.send('ok');
    });

    wrap({}, {
      send: () => done(),
    });
  });

  it('Error request', (done) => {
    const wrap = requestHandlerAsync(async (req, res) => {
      throw 'omg!!';
    });

    wrap({}, {}, () => done());
  })
});

describe('errorRequestHandlerAsync()', () => {
  it('success request', (done) => {
    const wrap = errorRequestHandlerAsync(async (error, req, res) => {
      res.send('ok');
    });

    wrap(new Error('omg!!'), {}, {
      send: () => done(),
    });
  });

  it('Error request', (done) => {
    const wrap = errorRequestHandlerAsync(async (error, req, res) => {
      throw 'omg!!';
    });

    wrap(new Error('omg!!'), {}, {}, () => done());
  })
});

describe('requestParamHandlerAsync()', () => {
  it('success request', (done) => {
    const wrap = requestParamHandlerAsync(async (req, res, next, value, name) => {
      res.send('ok');
    });

    wrap({}, {
      send: () => done(),
    }, () => { }, 'abc', '123');
  });

  it('Error request', (done) => {
    const wrap = requestParamHandlerAsync(async (req, res, next, value, name) => {
      throw 'omg!!';
    });

    wrap({}, {}, () => done(), 'abc', '123');
  })
});


