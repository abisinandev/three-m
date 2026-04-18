import { ConnectionOptions } from 'bullmq';
import { env } from '@presentation/express/utils/constants/env.constants';

export const queueConfig: ConnectionOptions = {
  host: env.REDIS_URL.includes('://') ? undefined : env.REDIS_URL,
  port: Number(env.REDIS_PORT),
};


export const bullConnection: ConnectionOptions = {
    host: '127.0.0.1',
    port: Number(env.REDIS_PORT) || 6379,
};
