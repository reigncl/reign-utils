// tslint:disable:max-line-length
import { RequestHandler, RequestParamHandler, ErrorRequestHandler, NextFunction, Response, Request } from 'express';

export const requestHandlerAsync = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>, thisArg?: any): RequestHandler => {
  return (req, res, next) =>
    Promise.resolve(
      requestHandler.apply(thisArg, [req, res, next]),
    ).catch(next);
};

export const requestParamHandlerAsync = (requestParamHandler: (req: Request, res: Response, next: NextFunction, value: any, name: string) => Promise<any>, thisArg?: any): RequestParamHandler => {
  return (req, res, next, value, name) =>
    Promise.resolve(
      requestParamHandler.apply(thisArg, [req, res, next, value, name]),
    ).catch(next);
};

export const errorRequestHandlerAsync = (errorRequestHandler: (error: any, req: Request, res: Response, next: NextFunction) => Promise<any>, thisArg?: any): ErrorRequestHandler => {
  return (err, req, res, next) =>
    Promise.resolve(
      errorRequestHandler.apply(thisArg, [err, req, res, next]),
    ).catch(next);
};
