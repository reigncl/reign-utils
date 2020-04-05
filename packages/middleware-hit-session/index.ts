import { lookup } from 'geoip-lite';
import onFinished from 'on-finished';
import { Request } from 'express';

export const userAgentToPlatform = (userAgent?: string) => {
  if (userAgent) {
    const isMobile = /^(okhttp|AlviApp|SMUUnimarcApp)/i.test(userAgent);

    return isMobile ? 'MOBILE' : 'WEB';
  }
}

const getHit = (req: Request<any>) => {
  const ip = req.headers['x-forwarded-for'] as string;
  const geo = lookup(ip);
  const location = { lat: geo?.ll?.[0], lon: geo?.ll?.[1] };
  const platform = userAgentToPlatform(req.headers['user-agent']);
  const routeName: undefined | string = undefined;

  const hit = {
    ip,
    status: undefined as undefined | number,
    statusText: undefined as undefined | string,
    location,
    routeName,
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

export const middlewareHitSession = (cb?: (res: ReturnType<typeof getHit>) => void) => {
  return (req: any, res: any, next: any) => {
    const hit = getHit(req);

    const t = Date.now();

    if (cb ?? false) {
      onFinished(req, () => {
        hit["response-time"] = Date.now() - t;
        hit.routeName = (req as any)[Symbol.for('route-name')] ?? hit.path;
        hit.status = res.status;
        hit.statusText = res.statusText;
        cb?.(hit);
      });
    }

    return next();
  };
};