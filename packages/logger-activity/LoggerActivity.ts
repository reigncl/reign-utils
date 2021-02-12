import { ActivityEvent } from "./ActivityEvent";
import { LoggerActivityOptions } from "./LoggerActivityOptions";

export class LoggerActivity {
  private constructor(private options: LoggerActivityOptions) {}

  sendMessage(message: ActivityEvent) {
    this.options.loggerMessage.sendMessage(message);
  }

  static createLogger(options: LoggerActivityOptions) {
    return new LoggerActivity(options);
  }
}
