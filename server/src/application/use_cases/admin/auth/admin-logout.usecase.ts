import type { IAdminLogoutUseCase } from "@application/use_cases/admin/interfaces/admin-logout.interface";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { injectable } from "inversify";

@injectable()
export class AdminLogoutUseCase implements IAdminLogoutUseCase {
  async execute(data: { id: string; adminCode?: string }): Promise<void> {
    await redisClient.del(`refresh_token:${data.id}`);
  }
}
