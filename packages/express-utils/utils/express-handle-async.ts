import { deprecate } from 'util';
export { errorRequestHandlerAsync, requestHandlerAsync, requestParamHandlerAsync } from '../handle-async';

deprecate(
  () => { },
  'Module deprecated. Please use `@reignmodule/express-utils/handle-async` not `@reignmodule/express-utils/utils/express-handle-async`',
)();
