import auth, { Options } from 'express-jwt';
import pathToRegexp from 'path-to-regexp';
import jwt, { decode } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface jwtACLMiddlewareRequest extends Request {
  ACL: {
    resources: any[]
  }
  user?: {
    [key: string]: any
    ACL?: any[]
  }
}

const generalOptions: {
  custom?: any
  secret?: Options['secret']
  serviceName?: any
  allowTrustedSources?: boolean
} = {};

function replaceAllStars(string: string) {
  let maxLoop = 25;
  let prevStep = '';
  let replaced = string;
  while (replaced !== prevStep && maxLoop > 0) {
    prevStep = replaced;
    replaced = replaced.replace(/(^|\))([^(*]*)(\*)+/, '$1$2(.*)');
    maxLoop -= 1;
  }
  return replaced;
}

export function checkAction(
  req: jwtACLMiddlewareRequest,
  options: typeof generalOptions,
  ACL?: any[]
): {
  approved: boolean
  resources: any[]
} {
  let approved = false;
  const resources: any[] = [];

  if (!ACL) return {
    approved,
    resources,
  };

  for (let i = 0; i < ACL.length; i += 1) {
    const item = ACL[i];
    for (let a = 0; a < item.actions.length; a += 1) {
      const action = item.actions[a];
      const actionSplitted = action.split(' ');
      const methods = actionSplitted.slice(0, actionSplitted.length - 1);
      const path = replaceAllStars(actionSplitted[actionSplitted.length - 1]);
      if (
        (methods.includes(req.method) || methods.includes('*'))
        && pathToRegexp(path).test(`/${options.serviceName}${req.originalUrl}`)) {
        approved = true;
        if (item.resources) {
          resources.push(...item.resources);
        }
        break;
      }
    }
  }
  return { approved, resources };
}

export default (options: typeof generalOptions) => {
  let currentOptions = generalOptions;

  if (options) {
    if (options.custom) currentOptions = options;
    else {
      generalOptions.secret = options.secret;
      generalOptions.serviceName = options.serviceName;
      generalOptions.allowTrustedSources = options.allowTrustedSources;
    }
  }

  return (req: jwtACLMiddlewareRequest, res: Response, next: NextFunction) => {

    if (currentOptions.allowTrustedSources && String(req.headers['untrusted-source']).toLowerCase() !== 'true') {
      const { authorization = '' } = req.headers;

      const token = authorization.split(' ').pop();

      try {
        req.user = <jwtACLMiddlewareRequest['user']>jwt.decode(<string>token);
      } catch (e) {
        req.user = {};
      }

      req.ACL = {
        resources: []
      };

      return next();
    }

    return auth({ secret: <Options['secret']>currentOptions.secret })(req, res, (error) => {
      if (error) return next(error);

      const { approved, resources } = checkAction(req, currentOptions, req.user && req.user.ACL);

      if (!approved) {
        return res.status(401).send({
          status: 401,
          code: 'UNAUTHORIZED',
          description: `Unauthorized action: '${req.method} /${currentOptions.serviceName}${req.originalUrl}'`,
        });
      }

      req.ACL = {
        resources,
      };

      return next();
    });
  }
};
