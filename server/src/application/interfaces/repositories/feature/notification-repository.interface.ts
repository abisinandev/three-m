import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface INotificationRepository extends IBaseRepository<NotificationEntity> {
    save(notification: NotificationEntity): Promise<NotificationEntity>;
    markAsRead(id: string, userId: string): Promise<void>;
    markAllRead(userId: string): Promise<number>;
    countUnread(userId: string): Promise<number>;
} 