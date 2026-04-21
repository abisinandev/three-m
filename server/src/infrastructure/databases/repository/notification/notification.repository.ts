import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { BaseRepository } from "../base.repository";
import { NotificationDocument } from "@infrastructure/databases/mongo_db/models/interfaces/notification/notification-schema.interface";
import { NotificationMapper } from "@infrastructure/mappers/notification/notification.mapper";
import { NotificationModel } from "@infrastructure/databases/mongo_db/models/schemas/notification-schema/notification-schema";
import { inject, injectable } from "inversify";
import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";

@injectable()
export class NotificationRepository extends BaseRepository<NotificationEntity, NotificationDocument> implements INotificationRepository {
    private readonly CACHE_TTL = 3600; // 1 hour

    constructor(
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _cacheProvider: ICacheProvider
    ) {
        super(NotificationModel, NotificationMapper);
    }

    private getCacheKey(userId: string): string {
        return `notifications:user:${userId}`;
    }

    async save(notification: NotificationEntity): Promise<NotificationEntity> {
        const persistence = this.mapper.toPersistance(notification);
        const created = await this.model.create(persistence);
        const domainEntity = this.mapper.toDomain(created);

        const cacheKey = this.getCacheKey(notification.userId);
        const now = Date.now();
        const notificationJson = JSON.stringify(domainEntity);

        await redisClient.zadd(cacheKey, now, notificationJson);

        const oneHourAgo = now - (this.CACHE_TTL * 1000);
        await redisClient.zremrangebyscore(cacheKey, "-inf", oneHourAgo);

        await redisClient.expire(cacheKey, this.CACHE_TTL);

        return domainEntity;
    }

    async markAllRead(userId: string): Promise<number> {
        const result = await this.model.updateMany(
            { userId, read: false },
            { $set: { read: true } }
        );

        await redisClient.del(this.getCacheKey(userId));

        return result.modifiedCount;
    }

    async markAsRead(id: string, userId: string): Promise<void> {
        const result = await this.model.updateOne(
            { _id: id, userId },
            { $set: { read: true } }
        );

        if (result.matchedCount === 0) {
            throw new Error("Notification not found or access denied");
        }

        await redisClient.del(this.getCacheKey(userId));
    }

    async findByUser(userId: string, unreadOnly: boolean = false): Promise<NotificationEntity[]> {
        const cacheKey = this.getCacheKey(userId);
        const now = Date.now();
        const oneHourAgo = now - (this.CACHE_TTL * 1000);

        await redisClient.zremrangebyscore(cacheKey, "-inf", oneHourAgo);

        const cachedResults = await redisClient.zrevrange(cacheKey, 0, -1);

        if (cachedResults && cachedResults.length > 0) {
            let notifications = cachedResults.map(raw => JSON.parse(raw) as NotificationEntity);
            if (unreadOnly) {
                notifications = notifications.filter(n => !n.read);
            }
            return notifications;
        }

        const query: any = {
            userId,
            createdAt: { $gte: new Date(oneHourAgo) }
        };

        if (unreadOnly) {
            query.read = false;
        }

        const documents = await this.model.find(query).sort({ createdAt: -1 });
        const domainEntities = documents.map(doc => this.mapper.toDomain(doc));

        if (domainEntities.length > 0) {
            const pipeline = redisClient.pipeline();
            domainEntities.forEach(entity => {
                const timestamp = new Date(entity.createdAt).getTime();
                pipeline.zadd(cacheKey, timestamp, JSON.stringify(entity));
            });
            pipeline.expire(cacheKey, this.CACHE_TTL);
            await pipeline.exec();
        }

        return domainEntities;
    }

    async countUnread(userId: string): Promise<number> {
        return this.model.countDocuments({
            userId,
            read: false,
        });
    }
}
