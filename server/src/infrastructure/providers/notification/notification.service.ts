import { inject, injectable } from "inversify";
import { INotificationService, NotificationPayload } from "@application/interfaces/services/notification/notification-service.interface";
import { ISocketService } from "@application/interfaces/services/notification/socket-service.interface";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(NOTIFICATION_TYEPS.SocketService) private readonly _socketService: ISocketService
  ) {}

  send(userId: string, payload: NotificationPayload): void {
    this._socketService.emitNotificationToUser(userId, {
      id: payload.id,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      createdAt: payload.createdAt,
      data: payload.data
    });
  }
}
