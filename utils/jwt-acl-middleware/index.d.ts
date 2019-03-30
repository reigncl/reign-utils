/// <reference types="node" />
import auth, { Options } from 'express-jwt';
import { Request, Response, NextFunction } from 'express';
export interface jwtACLMiddlewareRequest extends Request {
    ACL: {
        resources: any[];
    };
    user?: {
        [key: string]: any;
        ACL?: any[];
    };
}
declare const generalOptions: {
    custom?: any;
    secret?: Options['secret'];
    serviceName?: any;
    allowTrustedSources?: boolean;
};
export declare function checkAction(req: jwtACLMiddlewareRequest, options: typeof generalOptions, ACL?: any[]): {
    approved: boolean;
    resources: any[];
};
declare const _default: (options: {
    custom?: any;
    secret?: string | Buffer | auth.SecretCallbackLong | auth.SecretCallback | undefined;
    serviceName?: any;
    allowTrustedSources?: boolean | undefined;
}) => (req: jwtACLMiddlewareRequest, res: Response, next: NextFunction) => any;
export default _default;
