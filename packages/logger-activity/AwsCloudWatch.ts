import winston, { createLogger } from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { pkgName, pkgVersion } from "@reignmodule/util-pkg";
import { ActivityEvent } from "./ActivityEvent";
import { once } from "./once";
import { LoggerMessage } from "./LoggerMessage";

export interface AwsCloudWatchOptions {
  logGroupName: string;
  logStreamName?: string;
  logStreamNamePkgName?: string;
  logStreamNamePkgVersion?: string;
  awsAccessKeyId?: string;
  awsSecretKey?: string;
  awsRegion?: string;
  transportsConsole?: boolean;
}

export class AwsCloudWatch implements LoggerMessage {
  private constructor(
    props: AwsCloudWatchOptions,
    private winstonLogger = createLogger({
      format: winston.format.json(),
      transports: [],
    })
  ) {
    const logStreamNamePkgName = props.logStreamNamePkgName ?? pkgName;
    const logStreamNamePkgVersion = props.logStreamNamePkgVersion ?? pkgVersion;
    const insid = uuidv4();
    const winstonCloudwatch = new WinstonCloudwatch({
      logGroupName: props.logGroupName,
      logStreamName:
        props.logStreamName ??
        (() =>
          `${dayjs().format(
            "YYYY/MM/DD"
          )}/[${logStreamNamePkgName}@${logStreamNamePkgVersion}]/${insid}`),
      awsAccessKeyId: props.awsAccessKeyId,
      awsSecretKey: props.awsSecretKey,
      awsRegion: props.awsRegion,
      messageFormatter: ({ message }) => JSON.stringify({ message }),
    });

    winstonLogger.add(winstonCloudwatch);
  }

  public static getInstance = once(
    (props: AwsCloudWatchOptions) => new AwsCloudWatch(props),
    (props) =>
      `${props.awsAccessKeyId}/${props.awsRegion}/${props.logGroupName}`
  );

  public getLogger() {
    return this.winstonLogger;
  }

  sendMessage(message: ActivityEvent) {
    this.winstonLogger.info(message);
  }
}
