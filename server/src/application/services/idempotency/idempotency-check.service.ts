import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { createRequestHash } from "@shared/utils/hash/create-hash";
import { inject, injectable } from "inversify";
import { IIdempotencyService } from "./interface/idempotency-service.interface";

@injectable()
export class IdempotencyService implements IIdempotencyService {

    constructor(
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _redis: ICacheProvider
    ) { }

    async checkAndLock(key: string, body: unknown): Promise<void> {

        const redisKey = `investment:${key}`;

        const requestHash = createRequestHash(body);

        const existing = await this._redis.get(redisKey);

        if (existing) {

            const parsed = JSON.parse(existing);

            if (
                parsed.hash === requestHash
            ) {

                throw new ValidationError(
                    "Duplicate request detected"
                );
            }

            throw new ValidationError(
                "Idempotency key already used with different payload"
            );
        }

        const locked =
            await this._redis.setNX(
                redisKey,
                JSON.stringify({
                    hash: requestHash
                }),
                60 // 1 minute
            );

        if (!locked) {

            throw new ValidationError(
                "Request already processing"
            );
        }
    }

    async clear(key: string) {

        await this._redis.delete(
            `investment:${key}`
        );
    }
}