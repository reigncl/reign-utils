import { cpus } from 'os';
import { fork, isWorker, isMaster } from 'cluster';

const defaultWorkers = cpus().length;

export default (
  workerRun: () => void,
  {
    workers = defaultWorkers,
  } = {},
) => {
  if (isMaster) {
    for (let n = 0; n < workers; n += 1) {
      fork();
    }
  }

  if (isWorker) {
    workerRun();
  }
};
