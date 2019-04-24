"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = __importDefault(require("express-jwt"));
const path_to_regexp_1 = __importDefault(require("path-to-regexp"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generalOptions = {};
function replaceAllStars(string) {
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
function checkAction(req, options, ACL) {
    let approved = false;
    const resources = [];
    if (!ACL)
        return {
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
            if ((methods.includes(req.method) || methods.includes('*'))
                && path_to_regexp_1.default(path).test(`/${options.serviceName}${req.originalUrl}`)) {
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
exports.checkAction = checkAction;
exports.default = (options) => {
    let currentOptions = generalOptions;
    if (options) {
        if (options.custom)
            currentOptions = options;
        else {
            generalOptions.secret = options.secret;
            generalOptions.serviceName = options.serviceName;
            generalOptions.allowTrustedSources = options.allowTrustedSources;
        }
    }
    return (req, res, next) => {
        if (currentOptions.allowTrustedSources && String(req.headers['untrusted-source']).toLowerCase() !== 'true') {
            const { authorization = '' } = req.headers;
            const token = authorization.split(' ').pop();
            try {
                req.user = jsonwebtoken_1.default.decode(token);
            }
            catch (e) {
                req.user = {};
            }
            req.ACL = {
                resources: []
            };
            return next();
        }
        return express_jwt_1.default({ secret: currentOptions.secret })(req, res, (error) => {
            if (error)
                return next(error);
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
    };
};
//# sourceMappingURL=index.js.map