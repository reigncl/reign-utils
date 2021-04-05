import parseAccessToken from ".";


describe('parseAccessToken', () => {
  it('Cannot found token', () => {
    const token = parseAccessToken({});

    expect(token).toStrictEqual(null);
  })

  it('get token from query (key param)', () => {
    const query = {
      key: 'aaa',
    }

    const token = parseAccessToken({ query });

    expect(token).toStrictEqual('aaa');
  });

  it('get token from query (access_token param)', () => {
    const query = {
      access_token: 'aaa',
    }

    const token = parseAccessToken({ query });

    expect(token).toStrictEqual('aaa');
  });

  it('get token from header (x-api-key param)', () => {
    const headers = {
      'x-api-key': 'aaa',
    }

    const token = parseAccessToken({ headers });

    expect(token).toStrictEqual('aaa');
  });

  it('get token from header (authentication param)', () => {
    const headers = {
      'authorization': 'Bearer aaa',
    }

    const token = parseAccessToken({ headers });

    expect(token).toStrictEqual('aaa');
  });

  it('request', () => {
    const request = {
      query: {},
      headers: {
        'authorization': 'Bearer aaa',
      },
    };

    const token = parseAccessToken(request);

    expect(token).toStrictEqual('aaa');
  });

});

