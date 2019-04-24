import { NextFunction, Request, RequestHandler, RequestParamHandler, Response } from 'express';

export const expressHandleAsync = (
  methodAsync: RequestHandler | RequestParamHandler | Function,
  thisArgs: any,
) => (req: Request, res: Response, next: NextFunction, ...args: any[]) => {
  const fn = thisArgs ? methodAsync.bind(thisArgs) : methodAsync;
  return Promise.resolve(fn(req, res, next, ...args)).catch(next);
};
