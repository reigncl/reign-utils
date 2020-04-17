import { createServer, IncomingMessage, get, Server } from "http";
import { middlewareHitSession } from '../index';
import { spy } from 'sinon';
import express from 'express';

describe("native nodejs", () => {
  const sp = spy();
  const server = createServer((req, res) => {
    middlewareHitSession(sp)(req, res);
    res.end();
  });

  before(() => {
    server.listen();
  });

  after(() => {
    server.close();
  });

  it('', async () => {
    const addr = server.address();
    const PORT = typeof addr === 'string' ? addr : addr?.port;

    const res = await new Promise<IncomingMessage>(resolve => get(`http://127.0.0.1:${PORT}/hi`, resolve));

    console.log(sp.args.pop()?.pop())

  });
});

describe('express', () => {
  const serverExpress = express();
  let server: Server;
  const sp = spy();

  serverExpress
    .use(middlewareHitSession(sp))
    .get('/test', (req, res) => setTimeout(() => res.json({}), 300));

  before(() => {
    server = serverExpress.listen();
  });

  after(() => {
    server.close();
  });

  it('Test', async () => {
    const addr = server.address();
    const PORT = typeof addr === 'string' ? addr : addr?.port;

    const res = await new Promise<IncomingMessage>(resolve => get(`http://127.0.0.1:${PORT}/test`, resolve));

    console.log(sp.args.pop()?.pop())

  });
});
