import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { redisClient } from "./redis.provider";

export class RedisCacheProvider implements ICacheProvider {
    async get(key: string): Promise<string | null> {
        return redisClient.get(key);
    }

    async set(key: string, value: string, ttlSeconds: number): Promise<void> {
        await redisClient.set(key, value, "EX", ttlSeconds);
    }

    async setNX(
        key: string,
        value: string,
        ttlSeconds: number
    ): Promise<boolean> {

        const result = await redisClient.set(
            key,
            value,
            "EX",
            ttlSeconds,
            "NX"
        );

        return result === "OK";
    }

    async delete(
        key: string
    ): Promise<void> {

        await redisClient.del(key);
    }
}
