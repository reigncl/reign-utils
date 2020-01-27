import { deprecate } from 'util';
export { listeningListener } from '../listening-listener';

deprecate(
  () => { },
  'Module deprecated. Please use `@reignmodule/express-utils/listening-listener` not `@reignmodule/express-utils/utils/listening-listener`',
)();
