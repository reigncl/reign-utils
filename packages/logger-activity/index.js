"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsCloudWatch = void 0;
var winston_1 = __importStar(require("winston"));
var winston_cloudwatch_1 = __importDefault(require("winston-cloudwatch"));
var dayjs_1 = __importDefault(require("dayjs"));
var uuid_1 = require("uuid");
var util_pkg_1 = require("@reignmodule/util-pkg");
var AwsCloudWatch = /** @class */ (function () {
    function AwsCloudWatch(props) {
        var _a;
        var logger = winston_1.createLogger({
            format: winston_1.default.format.json(),
            transports: [
            /*new (winston.transports.Console)*/
            ],
        });
        var cloudwatchConfig = {
            logGroupName: props.logGroupName,
            logStreamName: (_a = props.logStreamName) !== null && _a !== void 0 ? _a : dayjs_1.default().format("YYYY/MM/DD") + "/[" + util_pkg_1.pkgName + "@" + util_pkg_1.pkgVersion + "]/" + uuid_1.v4(),
            awsAccessKeyId: props.awsAccessKeyId,
            awsSecretKey: props.awsSecretKey,
            awsRegion: props.awsRegion,
            // @ts-ignore
            messageFormatter: function (_a) {
                var level = _a.level, message = _a.message, additionalInfo = _a.additionalInfo;
                return "" + JSON.stringify({
                    message: message,
                });
            },
        };
        // @ts-ignore
        logger.add(new winston_cloudwatch_1.default(cloudwatchConfig));
        this.logger = logger;
    }
    AwsCloudWatch.getInstance = function (props) {
        return new AwsCloudWatch(props);
    };
    AwsCloudWatch.prototype.getLogger = function () {
        return this.logger;
    };
    AwsCloudWatch.prototype.sendMessage = function (message) {
        this.logger.info(message);
    };
    return AwsCloudWatch;
}());
exports.AwsCloudWatch = AwsCloudWatch;
