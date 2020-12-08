import winston, { createLogger } from "winston";
import winstonCloudwatch from "winston-cloudwatch";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { pkgName, pkgVersion } from "@reignmodule/util-pkg";
import { ActivityEvent } from "./ActivityEvent";
import { once } from "./once";

export class AwsCloudWatch {
  private constructor(
    props: {
      logGroupName: string;
      logStreamName?: string;
      awsAccessKeyId: string;
      awsSecretKey: string;
      awsRegion: string;
      transportsConsole?: boolean;
    },
    private logger = createLogger({
      format: winston.format.json(),
      transports: [],
    })
  ) {
    logger.add(
      new winstonCloudwatch({
        logGroupName: props.logGroupName,
        logStreamName:
          props.logStreamName ??
          `${dayjs().format(
            "YYYY/MM/DD"
          )}/[${pkgName}@${pkgVersion}]/${uuidv4()}`,
        awsAccessKeyId: props.awsAccessKeyId,
        awsSecretKey: props.awsSecretKey,
        awsRegion: props.awsRegion,
        messageFormatter: ({ message }) =>
          JSON.stringify({
            message,
          }),
      })
    );
  }

  public static getInstance = once(
    (props: {
      logGroupName: string;
      awsAccessKeyId: string;
      awsSecretKey: string;
      awsRegion: string;
    }) => new AwsCloudWatch(props),
    (props) => `${props.awsRegion}/${props.logGroupName}`
  );

  public getLogger() {
    return this.logger;
  }

  sendMessage(message: ActivityEvent) {
    this.logger.info(message);
  }
}
