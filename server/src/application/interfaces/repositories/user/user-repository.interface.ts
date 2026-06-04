import type { UserEntity } from "@domain/entities/user/user.entity";
import type { QueryOptions } from "mongoose";
import { IBaseRepository } from "../base-repository.interface";

type UserField = keyof Pick<UserEntity, "email" | "phone">;

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByField(field: UserField, value: string): Promise<UserEntity | null>;
  verifyEmail(email: string): Promise<UserEntity | null>;
  updatePassword(id: string, password: string): Promise<void>;
  findWithFilters(options: QueryOptions): Promise<UserEntity[]>;
  CountActiveUsers(): Promise<{ totalActiveUsersCount: number }>;
  CountInActiveUsers(): Promise<{ totalInActiveUsersCount: number }>;
  CountVerifiedUsers(): Promise<{ totalVerifiedUsersCount: number }>;
  getTotalUsersCount(): Promise<number>;
  getPremiumUsersCount(): Promise<number>;
  getUserRegistrationGrowthByMonth(months: number): Promise<{ month: string; users: number; premium: number }[]>;
  updateSubscriptionData(userId: string, data: { subscriptionStatus: string; subscriptionPlan: string; subscriptionId?: string | null }): Promise<void>;
}
