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
    
  const lbl = label({ label: process.env.APPLICATION_NAME || 'unnamed-service' });
  const fancyFormat = printf(info => (
    `${info.timestamp} [${info.label}] ${info.level.toUpperCase()}: ${info.message}`
  ));
  
  const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(splat(), lbl, timestamp(), fancyFormat),
    exitOnError: false,
    transports: [
      new transports.Console(),
    ],
  });
  
  /* istanbul ignore next */
  if ((process.env.NODE_ENV === 'test' || process.env.ENV === 'test') && process.env.DEBUG_TEST !== 'true') {
    // eslint-disable-next-line no-param-reassign
    logger.transports.forEach((t) => { t.silent = true; });
  }
  if(!process.env.APPLICATION_NAME){
    logger.warn('[WARNING] Environment variable APPLICATION_NAME is unset');
  }

  module.exports = logger;
  module.exports.buildPrefix = (...prefixes) => (`[${prefixes.join('][')}]:`);