"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, label, printf, timestamp, splat, } = winston_1.format;
const lbl = label({ label: process.env.APPLICATION_NAME || 'unnamed-service' });
const fancyFormat = printf(info => (`${info.timestamp} [${info.label}] ${info.level.toUpperCase()}: ${info.message}`));
exports.logger = winston_1.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(splat(), lbl, timestamp(), fancyFormat),
    exitOnError: false,
    transports: [
        new winston_1.transports.Console(),
    ],
});
/* istanbul ignore next */
if ((process.env.NODE_ENV === 'test' || process.env.ENV === 'test') && process.env.DEBUG_TEST !== 'true') {
    // eslint-disable-next-line no-param-reassign
    exports.logger.transports.forEach((t) => { t.silent = true; });
}
if (!process.env.APPLICATION_NAME) {
    exports.logger.warn('[WARNING] Environment variable APPLICATION_NAME is unset');
}
exports.buildPrefix = (...prefixes) => (`[${prefixes.join('][')}]:`);
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map