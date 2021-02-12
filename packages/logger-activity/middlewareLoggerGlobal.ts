import { ActivityEvent } from "./ActivityEvent";

declare global {
  namespace Express {
    interface Response {
      loggerActivity?: { message: ActivityEvent };
    }
  }
}
