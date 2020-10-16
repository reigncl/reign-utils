import { LatencyCloudWatchLogs } from './LatencyCloudWatchLogs';

export const lcwl = new LatencyCloudWatchLogs(process.env.LCWL_LOGGROUPNAME ?? 'LatencyIntegrations');

export const latencyFunction = <T>(method: string, fn: () => T) => lcwl.latencyFunction(method, fn);
