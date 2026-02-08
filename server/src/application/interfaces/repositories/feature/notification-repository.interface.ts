import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface INotificationReposiory extends IBaseRepository<NotificationEntity> {
    // save(notification: Notification): Promise<Notification>;
    // markAsRead(id: string, userId: string): Promise<void>;
    // markAllRead(userId: string): Promise<number>;
    // countUnread(userId: string): Promise<number>;
}