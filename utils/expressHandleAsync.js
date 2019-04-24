module.exports = (methodAsync, thisArgs) => (req, res, next, ...args) => {
  const fn = thisArgs ? methodAsync.bind(thisArgs) : methodAsync;
  return fn(req, res, next, ...args).catch(next);
};
