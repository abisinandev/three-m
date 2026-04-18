import { ConnectionOptions } from 'bullmq';
import { env } from '@presentation/express/utils/constants/env.constants';

export const bullConnection: ConnectionOptions = {
    host: env.REDIS_URL.includes('://') ? undefined : env.REDIS_URL.replace('redis://', '').split(':')[0],
    port: Number(env.REDIS_PORT) || 6379,
};

if (env.REDIS_URL.includes('://')) {
    (bullConnection as any).url = env.REDIS_URL;
}
