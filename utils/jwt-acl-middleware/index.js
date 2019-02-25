const auth = require('express-jwt');
const pathToRegexp = require('path-to-regexp');
const jwt = require('jsonwebtoken');

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
  if (!ACL) return { approved, resources };
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


const generalOptions = {};
module.exports = (options) => {
  let currentOptions = generalOptions;
  if (options) {
    if (options.custom) currentOptions = options;
    else {
      generalOptions.secret = options.secret;
      generalOptions.serviceName = options.serviceName;
      generalOptions.allowTrustedSources = options.allowTrustedSources;
    }
  }
  return (req, res, next) => {
    if(currentOptions.allowTrustedSources && String(req.headers['untrusted-source']).toLowerCase() !== 'true'){
      const token = req.headers["authorization"].split(' ').pop(); 
      req.user = jwt.decode(token);
      req.ACL = { resources: {} };
      return next();
    }
    return auth({ secret: currentOptions.secret })(req, res, (error) => {
      if (error) return next(error);
      const { approved, resources } = checkAction(req, currentOptions, req.user.ACL);
      if (!approved) {
        return res.status(401).send({
          status: 401,
          code: 'UNAUTHORIZED',
          description: `Unauthorized action: '${req.method} /${currentOptions.serviceName}${req.originalUrl}'`,
        });
      }
      req.ACL = { resources };
      return next();
    });
  }
};
