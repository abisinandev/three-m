import { env } from "@presentation/express/utils/constants/env.constants";
import Redis from "ioredis";
import { logger } from "../logger/pino.logger";


export const redisClient = new Redis(env.REDIS_URL);

redisClient.on("connect", () => logger.info("Redis connected"));
redisClient.on("error", (err) => logger.error(`Redis error: ${err}`));

