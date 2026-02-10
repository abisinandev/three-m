import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";

export interface NotificationPayload {
    type: NotificationType;
    title: string;
    message: string;
}

export interface INotificationService {
  send(userId: string, payload: { title?: string; message: string; meta?: any }): void;
}