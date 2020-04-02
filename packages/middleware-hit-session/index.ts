import { requestHandlerAsync } from '@reignmodule/express-utils/handle-async';
import { lookup } from 'geoip-lite';
import onFinished from 'on-finished';
import express from 'express';

export const userAgentToPlatform = (userAgent?: string) => {
  if (userAgent) {
    const isMobile = /^(okhttp|AlviApp|SMUUnimarcApp)/i.test(userAgent);

    return isMobile ? 'MOBILE' : 'WEB';
  }
}

const getHit = (req: express.Request<any>) => {
  const ip = req.headers['x-forwarded-for'] as string;
  const geo = lookup(ip);
  const location = { lat: geo?.ll?.[0], lon: geo?.ll?.[1] };
  const platform = userAgentToPlatform(req.headers['user-agent']);

  const hit = {
    ip,
    location,
    userAggent: req.headers['user-agent'],
    platform,
    path: req.path,
    host: req.hostname,
    method: req.method,
    'response-time': undefined as number | undefined,
    req: {
      path: req.path,
      host: req.hostname,
      method: req.method,
      url: req.url,
      headers: {
        ...req.headers,
        authorization: undefined,
        cookie: undefined,
      },
    },
  };

  return hit;
}

export const middlewareHitSession = (cb?: (res: ReturnType<typeof getHit>) => void): express.RequestHandler => {
  return (req, res, next) => {
    const hit = getHit(req);

    const t = Date.now();

    onFinished(res, () => {
      hit["response-time"] = Date.now() - t;
      cb?.(hit);
    });

    return next();
  };
};