
const localStorageDisabled = new Proxy({}, {
  get(t, p, r) {
    return undefined
  }
});
// @ts-ignore
globalThis.localStorage = localStorageDisabled;

import fetch from 'node-fetch';

// @ts-ignore
globalThis.fetch = fetch;

import { createServer } from "http";
import { promisify } from "util";
import { ClientOAuth2, ExchangeResult } from "./ClientOAuth2";
import express from 'express';
import bodyParser from 'body-parser';

const initAuthServer = () => {
  const app = express().use(bodyParser.json())

  app.post('/token', (req, res, next) => {
    if (req.body.grant_type === 'authorization_code') {
      if (req.body.code === 'codeaaaaa') {
        return res.json({ token_type: 'demo', expires_in: 60, access_token: 'AVASDVASDaccess_tokenASJHUNERTY', refresh_token: 'ASGVAVSArefresh_tokenASDVSAD' });
      }
    }
    if (req.body.grant_type === 'refresh_token') {
      return res.json({ token_type: 'demo', expires_in: 60, access_token: 'AVASDVASDaccess_tokenASJHUNERTY2', refresh_token: 'ASGVAVSArefresh_tokenASDVSAD2' });
    }

    return next();
  })

  app.use((req, res) => res.status(404).json({ error: { message: `cannot found ${req.method} ${req.url}` } }));

  const server = createServer(app)

  beforeAll(async () => {
    await promisify(cb => server.listen(cb))()
  })

  afterAll(async () => {
    await promisify(cb => server.close(err => cb(err, null)))()
  })

  return {
    baseurl: () => {
      const addr = server.address()

      return typeof addr === 'string' ? addr : addr ? `http://localhost:${addr.port}` : undefined;
    }
  }
}

declare global {
  interface ClientOAuth2Exchanges {
    custonexchange(): Promise<ExchangeResult>
  }
}

describe('ClientOAuth2', () => {
  const authServer = initAuthServer()

  it('new instance', () => {
    const clientOAuth2 = new ClientOAuth2({
      authorizationUri: `${authServer.baseurl()}/authorize`,
      tokenUri: `${authServer.baseurl()}/token`,
    });

    const a = clientOAuth2.getAutorizationUri()

    // expect(a.uri).t(String)
  });

  it('restore secure state', () => {
    const clientOAuth2A = new ClientOAuth2({
      authorizationUri: `${authServer.baseurl()}/authorize`,
      tokenUri: `${authServer.baseurl()}/token`,
    });

    const clientOAuth2B = new ClientOAuth2({
      authorizationUri: `${authServer.baseurl()}/authorize`,
      tokenUri: `${authServer.baseurl()}/token`,
    });

    const clientOAuth2C = new ClientOAuth2({
      authorizationUri: `${authServer.baseurl()}/authorize`,
      tokenUri: `${authServer.baseurl()}/token`,
      state: clientOAuth2A.state,
    });

    const stateA = clientOAuth2A.state;
    const stateB = clientOAuth2B.state;
    const stateC = clientOAuth2C.state;

    expect(stateB).not.toEqual(stateA);
    expect(stateC).toEqual(stateA);
  })

  it('exchange code', async () => {
    const clientOAuth2 = new ClientOAuth2({
      authorizationUri: `${authServer.baseurl()}/authorize`,
      tokenUri: `${authServer.baseurl()}/token`,
      state: 'aaaa',
      clientId: 'asd',
      storage: {},
    });

    expect(await clientOAuth2.getToken()).toBeUndefined()

    await clientOAuth2.exchangeCode('codeaaaaa');

    expect(await clientOAuth2.getToken()).not.toBeUndefined()
  })

  it('exchange refrsh token', async () => {
    const clientOAuth2 = new ClientOAuth2({
      authorizationUri: `${authServer.baseurl()}/authorize`,
      tokenUri: `${authServer.baseurl()}/token`,
      state: 'aaaa',
      clientId: 'asd',
      storage: {},
    });

    expect(await clientOAuth2.getToken()).toBeUndefined()

    await clientOAuth2.exchangeCode('codeaaaaa');
    await clientOAuth2.exchangeRefreshToken();

    expect(await clientOAuth2.getToken()).not.toBeUndefined()
  })

  it('exchange custom', async () => {
    const clientOAuth2 = new ClientOAuth2({
      authorizationUri: `${authServer.baseurl()}/authorize`,
      tokenUri: `${authServer.baseurl()}/token`,
      state: 'aaaa',
      clientId: 'asd',
      storage: {},
    });

    clientOAuth2.use('custonexchange', (client) => async () => {
      expect(client).toStrictEqual(clientOAuth2);

      return {
        access_token: 'custonaccesstoken',
        expires_in: 1000,
      };
    });

    await clientOAuth2.exchange('custonexchange');

    expect(await clientOAuth2.getToken()).toEqual('custonaccesstoken');
  })
});
