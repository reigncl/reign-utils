export {
  Action,
  ActivityEvent,
  TypeUserUpdated,
  TypeCouponAction,
} from "./ActivityEvent";
import { ActivityEvent } from "./ActivityEvent";
import { LoggerMessage } from "./LoggerMessage";

export interface LoggerActivityOptions {
  loggerMessage: LoggerMessage;
}

export class LoggerActivity {
  private constructor(private options: LoggerActivityOptions) {}

  sendMessage(message: ActivityEvent) {
    this.options.loggerMessage.sendMessage(message);
  }

  static createLogger(options: LoggerActivityOptions) {
    return new LoggerActivity(options);
  }
}
