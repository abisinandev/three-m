import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { BaseRepository } from "../base.repository";
import { NotificationDocument } from "@infrastructure/databases/mongo_db/models/interfaces/notification/notification-schema.interface";
import { NotificationMapper } from "@infrastructure/mappers/notification/notification.mapper";
import { NotificationModel } from "@infrastructure/databases/mongo_db/models/schemas/notification-schema/notification-schema";
import { injectable } from "inversify";
import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { FilterQuery } from "mongoose";

@injectable()
export class NotificationRepository extends BaseRepository<NotificationEntity, NotificationDocument> implements INotificationRepository {

    constructor() {
        super(NotificationModel, NotificationMapper);
    }

    async save(notification: NotificationEntity): Promise<NotificationEntity> {
        const persistence = this.mapper.toPersistance(notification);
        const created = await this.model.create(persistence);
        return this.mapper.toDomain(created);
    }

    async markAllRead(userId: string): Promise<number> {
        const result = await this.model.updateMany(
            { userId, read: false },
            { $set: { read: true } }
        );
        return result.modifiedCount;
    }

    async markAsRead(id: string, userId: string): Promise<void> {
        if (!id || id === "undefined" || id.length !== 24) {
            console.warn(`[NotificationRepository] Invalid notification ID provided: ${id}`);
            return;
        }

        await this.model.updateOne(
            { _id: id, userId },
            { $set: { read: true } }
        );
    }

    async findByUser(userId: string, unreadOnly: boolean = false): Promise<NotificationEntity[]> {
        const query: FilterQuery<NotificationDocument> = { userId };

        if (unreadOnly) {
            query.read = false;
        }

        const documents = await this.model.find(query).sort({ createdAt: -1 });
        return documents.map(doc => this.mapper.toDomain(doc));
    }

    async countUnread(userId: string): Promise<number> {
        return this.model.countDocuments({
            userId,
            read: false,
        });
    }
}
