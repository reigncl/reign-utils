import { lookup } from 'geoip-lite';
import onFinished from 'on-finished';
import { Request } from 'express';
import { IncomingMessage } from 'http';
import url from 'url';

export const userAgentToPlatform = (userAgent?: string) => {
  if (userAgent) {
    const isMobile = /^(okhttp|AlviApp|SMUUnimarcApp)/i.test(userAgent);

    return isMobile ? 'MOBILE' : 'WEB';
  }
}

export const routerName = Symbol('route-name');

export const getRouteName = (req: any): string | undefined => req?.[routerName];

export const setRouterName = (routerNameVal: string) => (req: any, res?: any, next?: any) => {
  req[routerName] = routerNameVal;
  next?.();
};

const getHit = (req: IncomingMessage) => {
  const ip = req.headers['x-forwarded-for'] as string;
  const geo = lookup(ip);
  const location = { lat: geo?.ll?.[0], lon: geo?.ll?.[1] };
  const platform = userAgentToPlatform(req.headers['user-agent']);
  const routeName: string | undefined = getRouteName(req);

  const uri = req.url ? url.parse(req.url) : undefined;

  const hit = {
    ip,
    statusCode: undefined as undefined | number,
    statusMessage: undefined as undefined | string,
    location,
    routeName,
    userAggent: req.headers['user-agent'],
    platform,
    path: uri?.path ?? undefined,
    host: uri?.hostname ?? undefined,
    method: req.method,
    'response-time': undefined as number | undefined,
    req: {
      path: uri?.path ?? undefined,
      host: uri?.hostname ?? undefined,
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

export const middlewareHitSession = (cb?: (res: ReturnType<typeof getHit>) => void) => {
  return (req: IncomingMessage, res: any, next?: any) => {
    const t = Date.now();

    const hit = getHit(req);

    if (cb ?? false) {
      onFinished(res, (err) => {
        console.log(err);
        hit["response-time"] = Date.now() - t;
        hit.routeName = getRouteName(req) ?? hit.path;
        hit.statusCode = res.statusCode;
        hit.statusMessage = res.statusMessage;

        cb?.(hit);
      });
    }

    return next?.();
  };
};