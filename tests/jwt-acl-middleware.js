/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const jwt = require('jsonwebtoken');
const chai = require('chai');

const { default: authACL } = require('../utils/jwt-acl-middleware');
const config = {
  serviceName: 'service-name',
  secret: "secret",
}

const { expect } = chai;

authACL(config);


describe('jwt-acl-middleware', () => {
  const ACLExample = [
    {
      actions: [`* /${config.serviceName}/*`],
      resources: [{
        type: 'all',
      }, {
        type: 'all2',
      }],
    },
    {
      actions: [`* /${config.serviceName}/resource`],
      resources: [
        {
          type: 'resource',
        },
      ],
    },
    {
      actions: [`get /${config.serviceName}/resource`],
      resources: [
        {
          type: 'get-resource',
        },
      ],
    },
  ];
  const jwtBearer = `Bearer ${jwt.sign({ ACL: ACLExample }, config.secret)}`;

  it('ACL auth use global options when no options are given', (done) => {
    authACL()({ headers: { authorization: jwtBearer }, originalUrl: '/url', method: 'POST' }, {
      status: () => ({ send: done }),
    }, done);
  });

  it('ACL auth use custom options when are given with custom flag', (done) => {
    authACL({
      serviceName: '/no-this-service',
      secret: config.secret,
      custom: true,
    })({ headers: { authorization: jwtBearer }, originalUrl: '/url', method: 'POST' }, {
      status: () => ({ send: () => done() }),
    }, () => done(new Error('authorization given, but should not')));
  });

  it('ACL auth should set resources', (done) => {
    const req = { headers: { authorization: jwtBearer }, originalUrl: '/resource', method: 'GET' };
    authACL()(req, {
      status: () => ({ send: done }),
    },
      (err) => {
        if (err) done(err);
        expect(req.ACL).not.to.be.undefined;
        expect(req.ACL.resources).to.be.an('array');
        expect(req.ACL.resources.every(r => ['all', 'all2', 'resource', 'get-resource'].includes(r.type))).to.be.true;
        done();
      });
  });

  it('ACL auth should exclude resources that not match ACL', (done) => {
    const req = { headers: { authorization: jwtBearer }, originalUrl: '/resource', method: 'POST' };
    authACL()(req, {
      status: () => ({ send: done }),
    },
      (err) => {
        if (err) done(err);
        expect(req.ACL).not.to.be.undefined;
        expect(req.ACL.resources).to.be.an('array');
        expect(req.ACL.resources.every(r => ['all', 'all2', 'resource'].includes(r.type))).to.be.true;
        expect(req.ACL.resources.every(r => !['get-resource'].includes(r.type))).to.be.true;
        done();
      });
  });

  it('ACL should not trust in untrusted-sources', (done) => {
    authACL({
      serviceName: '/no-this-service',
      secret: config.secret,
      custom: true,
      allowTrustedSources: true,
    })({ headers: { authorization: jwtBearer, 'untrusted-source': true }, originalUrl: '/url', method: 'POST' }, {
      status: () => ({ send: () => done() }),
    }, () => done(new Error('authorization given, but should not')));
  });

  it('ACL should trust in trusted sources', (done) => {
    authACL({
      serviceName: '/no-this-service',
      secret: config.secret,
      custom: true,
      allowTrustedSources: true,
    })({ headers: { authorization: jwtBearer }, originalUrl: '/url', method: 'POST' }, {
      status: () => ({ send: () => done() }),
    }, () => done());
  });
});
