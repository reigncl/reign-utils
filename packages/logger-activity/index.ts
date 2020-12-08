import winston, { createLogger, Logger } from "winston";
import winstonCloudwatch from "winston-cloudwatch";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { pkgName, pkgVersion } from "@reignmodule/util-pkg";
import { ActivityEvent } from "./Action";

export class AwsCloudWatch {
  private static instance: AwsCloudWatch;
  logger: Logger;
  private constructor(props: {
    logGroupName: string;
    logStreamName?: string;
    awsAccessKeyId: string;
    awsSecretKey: string;
    awsRegion: string;
    transportsConsole?: boolean;
  }) {
    const logger = createLogger({
      format: winston.format.json(),
      transports: [
        /*new (winston.transports.Console)*/
      ],
    });
    const cloudwatchConfig = {
      logGroupName: props.logGroupName,
      logStreamName:
        props.logStreamName ??
        `${dayjs().format(
          "YYYY/MM/DD"
        )}/[${pkgName}@${pkgVersion}]/${uuidv4()}`,
      awsAccessKeyId: props.awsAccessKeyId,
      awsSecretKey: props.awsSecretKey,
      awsRegion: props.awsRegion,
      // @ts-ignore
      messageFormatter: ({ level, message, additionalInfo }) =>
        `${JSON.stringify({
          message,
        })}`,
    };
    // @ts-ignore
    logger.add(new winstonCloudwatch(cloudwatchConfig));
    this.logger = logger;
  }
  public static getInstance(props: {
    logGroupName: string;
    awsAccessKeyId: string;
    awsSecretKey: string;
    awsRegion: string;
  }): AwsCloudWatch {
    return new AwsCloudWatch(props);
  }
  public getLogger() {
    return this.logger;
  }
  sendMessage(message: ActivityEvent) {
    this.logger.info(message);
  }
}
