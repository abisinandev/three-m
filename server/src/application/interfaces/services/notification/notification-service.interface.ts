import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";

export interface NotificationPayload {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
}

export interface INotificationService {
  send(userId: string, payload: NotificationPayload): void;
}