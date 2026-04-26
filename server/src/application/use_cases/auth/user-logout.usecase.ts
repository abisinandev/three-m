import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { injectable } from "inversify";
import type { IUserLogoutUseCase } from "./interfaces/user-logout-usecase.interface";

@injectable()
export class LogoutUseCase implements IUserLogoutUseCase {
  async execute(req: { userId: string }): Promise<void> {
    await redisClient.del(`refresh_token:${req.userId}`);
  }
}
