import { createPushHit } from "..";
import http from 'http';

describe('Push Hit', () => {
  let server: http.Server;
  const getPort = () => {
    const a = server?.address?.();
    if (!a) return null;
    return typeof a === 'string' ? a : a.port;
  }

  afterEach((done) => {
    server.close(done);
  });

  beforeEach((done) => {
    server = http.createServer((req, res) => {
      const d: any[] = [];

      req.read()

      req.on('data', chunk => {
        // console.log('c', chunk);
        d.push(chunk);
      });

      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        console.log('b', Buffer.concat(d).toString());

        res.end('ok');
      });
    });

    server.listen(() => {
      done();
    });
  });

  it('Create Push Hit', async () => {
    const pushHit = createPushHit({
      baseUrl: `http://127.0.0.1:${getPort()}`,
      inervalPush: '2ms'
    });

    for (const iterator of Array(100).fill(undefined).map((_, i) => i)) {
      pushHit.push({
        _index: 'abc',
        iterator,
      });
    }

    await new Promise(r => setTimeout(r, 100));
  });
});
