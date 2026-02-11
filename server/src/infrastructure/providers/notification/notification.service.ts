import { injectable } from "inversify";
import { emitNotificationToUser } from "./socket.configs";
import { INotificationService, NotificationPayload } from "@application/interfaces/services/notification/notification-service.interface";

@injectable()
export class NotificationService implements INotificationService {
  send(userId: string, payload: NotificationPayload): void {
    emitNotificationToUser(userId, {
      id: payload.id,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      createdAt: new Date(),
    });
  }
}
