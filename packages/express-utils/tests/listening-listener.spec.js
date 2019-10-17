const http = require('http');
const https = require('https');
const http2 = require('http2');
const { listeningListener } = require('../utils/listening-listener');

it('listener with http', (done) => {
  const server = http.createServer();
  server.listen(listeningListener);
  server.on('close', () => done());
  server.on('listening', () => {
    server.close();
  })
});

it('listener with https', (done) => {
  const server = https.createServer();
  server.listen(listeningListener);
  server.on('close', () => done());
  server.on('listening', () => {
    server.close();
  })
});

it('listener with http2', (done) => {
  const server = http2.createServer();
  server.listen(listeningListener);
  server.on('close', () => done());
  server.on('listening', () => {
    server.close();
  })
});
