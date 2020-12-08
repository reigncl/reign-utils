import winston, { Logger } from "winston";
import { ActivityEvent } from "./Action";
export declare class AwsCloudWatch {
    private static instance;
    logger: Logger;
    private constructor();
    static getInstance(props: {
        logGroupName: string;
        awsAccessKeyId: string;
        awsSecretKey: string;
        awsRegion: string;
    }): AwsCloudWatch;
    getLogger(): winston.Logger;
    sendMessage(message: ActivityEvent): void;
}
