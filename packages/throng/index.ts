import { cpus } from 'os';
import { fork, isWorker, isMaster } from 'cluster';

const defaultWorkers = cpus().length;

export default (
  workerRun: () => void,
  opts?: {
    workers?: number;
    env?: any;
  },
) => {
  const workers = opts?.workers ?? defaultWorkers;
  const env = opts?.env;
  if (isMaster) return Array(workers).fill(0).map(() => fork(env));
  if (isWorker) workerRun();
};
