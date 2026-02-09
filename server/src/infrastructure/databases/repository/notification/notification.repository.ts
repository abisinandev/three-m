import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { BaseRepository } from "../base.repository";
import { NotificationDocument } from "@infrastructure/databases/mongo_db/models/interfaces/notification/notification-schema.interface";
import { NotificationMapper } from "@infrastructure/mappers/notification/notification.mapper";
import { NotificationModel } from "@infrastructure/databases/mongo_db/models/schemas/notification-schema/notification-schema";
import { injectable } from "inversify";
import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";

@injectable()
export class NotificationRepository extends BaseRepository<NotificationEntity, NotificationDocument> implements INotificationRepository {

    constructor() {
        super(NotificationModel, NotificationMapper);
    }

    /**
     * Save a notification
     */
    async save(notification: NotificationEntity): Promise<NotificationEntity> {
        const persistence = this.mapper.toPersistance(notification);
        const created = await this.model.create(persistence);
        return this.mapper.toDomain(created);
    }

    /**
     * Mark all notifications as read for a user
     * Returns number of updated documents
     */
    async markAllRead(userId: string): Promise<number> {
        const result = await this.model.updateMany(
            { userId, isRead: false },
            { $set: { isRead: true } }
        );

        return result.modifiedCount;
    }

    /**
     * Mark a single notification as read
     */
    async markAsRead(id: string, userId: string): Promise<void> {
        const result = await this.model.updateOne(
            { _id: id, userId },
            { $set: { isRead: true } }
        );

        if (result.matchedCount === 0) {
            throw new Error("Notification not found or access denied");
        }
    }

    /**
     * Count unread notifications for a user
     */
    async countUnread(userId: string): Promise<number> {
        return this.model.countDocuments({
            userId,
            isRead: false,
        });
    }
}