import { cpus } from 'os';
import { fork, isWorker, isMaster } from 'cluster';

const defaultWorkers = cpus().length;

export default (
  workerRun: () => void,
  {
    workers = defaultWorkers,
    env = undefined as undefined | any,
  } = {},
) => {
  if (isMaster) return Array(workers).fill(0).map(() => fork(env));
  if (isWorker) workerRun();
};
