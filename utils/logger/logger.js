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
    
  const lbl = label({ label: process.env.SERVICE_NAME || 'unnamed-service' });
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
  if (process.env === 'test') {
    // eslint-disable-next-line no-param-reassign
    logger.transports.forEach((t) => { t.silent = true; });
  }

  if(!process.env.SERVICE_NAME){
    logger.warn('[WARNING] Environment variable SERVICE_NAME is unset');
  }
  
  module.exports = logger;
  module.exports.buildPrefix = (...prefixes) => (`[${prefixes.join('][')}]:`);