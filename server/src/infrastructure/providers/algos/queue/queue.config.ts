import { ConnectionOptions } from 'bullmq';
import { env } from '@presentation/express/utils/constants/env.constants';

/**
 * BullMQ connection configuration.
 * It uses the REDIS_URL from environment variables or defaults to 127.0.0.1.
 */
export const bullConnection: ConnectionOptions = {
    host: env.REDIS_URL.includes('://') ? undefined : env.REDIS_URL.replace('redis://', '').split(':')[0],
    port: Number(env.REDIS_PORT) || 6379,
};

// If using a full connection string (like for Upstash or cloud Redis)
if (env.REDIS_URL.includes('://')) {
    (bullConnection as any).url = env.REDIS_URL;
}
