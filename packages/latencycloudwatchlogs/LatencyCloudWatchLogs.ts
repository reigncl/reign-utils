import { CloudWatchLogs } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { promisify } from 'util';
import { createHash } from 'crypto';
import { hrtime } from './hrtime';
import { throws } from './throws';
import { lcwl } from './lcwl';
import { LatencyRefer } from './LatencyRefer';
import { clearIntervalAsync, IntervalAsync, setIntervalAsync } from './intervalAsync';

const once = <T>(f: () => T, m?: T) => () => (m = m ?? f(), m);

export class LatencyCloudWatchLogs {
    constructor(
        readonly logGroupName: string,
        readonly packageName: string = process.env.npm_package_name ?? throws(new TypeError('packageName must be a string. Can be `process.env.npm_package_name`.')),
        readonly logStreamName = `${Date.now()}_${uuid()}`,
        readonly cloudWatchLogs = new CloudWatchLogs({ region: 'us-east-1' }),
    ) {
        process.on('SIGINT', this.end)
        process.on('SIGTERM', this.end)
    }

    eventsPerPutEvents = 400_000

    logGroup = {
        logStreamName: this.logStreamName,
        logGroupName: this.logGroupName,
    };
    logEvents: CloudWatchLogs.InputLogEvents = [];
    sequenceToken: undefined | string;

    end = () => clearIntervalAsync(this.workerRinning)

    private workerRinning?: IntervalAsync;

    createLogStream = once(() => this.cloudWatchLogs.createLogStream(this.logGroup).promise());
    workerPutEvents = once(async () => {
        await this.createLogStream();

        this.workerRinning = setIntervalAsync(async () => {
            const logEventsToPush = this.logEvents.slice(0, this.eventsPerPutEvents);
            const nextLogEvents = this.logEvents.slice(this.eventsPerPutEvents);
            this.logEvents = nextLogEvents;
            // this.sum = 0

            if (logEventsToPush.length !== 0) {
                const putLogEventsResponse = await this.cloudWatchLogs.putLogEvents({
                    ...this.logGroup,
                    logEvents: logEventsToPush,
                    sequenceToken: this.sequenceToken,
                }).promise();

                this.sequenceToken = putLogEventsResponse.nextSequenceToken;
            }
        }, 200)

    });

    sum = 0
    push = ({ timestamp, ...body }: LatencyRefer) => {
        this.workerPutEvents();
        const message = JSON.stringify(body);
        this.sum += message.length
        if (this.sum >= 1_000_000 && this.logEvents.length < this.eventsPerPutEvents) {
            this.eventsPerPutEvents = this.logEvents.length - 1
            this.sum = 0;
            // console.log({ sum: this.sum, 'this.logEvents.length': this.logEvents.length })
        }
        this.logEvents.push({
            message,
            timestamp: timestamp ?? Date.now(),
        });
    }

    latencyFunction = async <T>(method: string, fn: () => T) => {
        const stack = new Error().stack;
        // const stackChunk = stack?.slice(0, 1000);
        const hash = stack ? createHash('md5').update(stack).digest('hex') : undefined;
        const time = hrtime();
        const result = await fn();
        this.push({
            method,
            packageName: this.packageName,
            hash,
            // stack: stackChunk,
            time: time(),
            timestamp: Date.now(),
        });
        return result;
    }
}
