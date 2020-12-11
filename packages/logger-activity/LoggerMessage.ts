import { ActivityEvent } from "./ActivityEvent";

export interface LoggerMessage {
  sendMessage(message: ActivityEvent): void;
}
