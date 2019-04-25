import chalk from 'chalk';
import { Server as ServerHttp } from 'http';
import { AddressInfo } from 'net';
import { format } from 'url';

export function listeningListener(this: ServerHttp) {
  const { address, port } = <AddressInfo>this.address();

  const protocol = (() => {
    if (this instanceof require('http').Server) return 'http';
    if (this instanceof require('https').Server) return 'https';
    if (this.constructor.name === 'Http2SecureServer') return 'https';
    return '';
  })();

  const hostname = (() => {
    switch (address) {
      case '0.0.0.0':
      case '::': return 'localhost';
      default: return address;
    }
  })();

  const link = format({
    hostname,
    port,
    protocol,
    slashes: true,
  });

  console.log(chalk`Server ready on {green ${link}}`);
}
