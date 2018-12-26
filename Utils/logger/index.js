const {
    createLogger, format, transports,
  } = require('winston');
  
  const {
    combine,
    label,
    printf,
    timestamp,
    splat,
  } = format;
  
  const config = require('../config');
  
  const lbl = label({ label: 'embonor-authentication-service' });
  const fancyFormat = printf(info => (
    `${info.timestamp} [${info.label}] ${info.level.toUpperCase()}: ${info.message}`
  ));
  
  const logger = createLogger({
    level: 'info',
    format: combine(splat(), lbl, timestamp(), fancyFormat),
    exitOnError: false,
    transports: [
      new transports.Console(),
    ],
  });
  
  /* istanbul ignore next */
  if (config.env === 'test') {
    // eslint-disable-next-line no-param-reassign
    logger.transports.forEach((t) => { t.silent = true; });
  }
  
  module.exports = logger;
  module.exports.buildPrefix = (...prefixes) => (`[${prefixes.join('][')}]:`);