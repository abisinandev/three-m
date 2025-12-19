import type { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import type { UserEntity } from "@domain/entities/user.entity";
import {
  type UserDocument,
  UserModel,
} from "@infrastructure/databases/mongo_db/models/schemas/user.schema";
import { UserMapper } from "@infrastructure/mappers/user.mapper";
import { injectable } from "inversify";
import type { QueryOptions } from "mongoose";
import { BaseRepository } from "../base.repository";

@injectable()
export class UserRepository extends BaseRepository<UserEntity, UserDocument> implements IUserRepository {
  constructor() {
    super(UserModel, UserMapper);
  }

  async findByField(field: "email" | "phone", value: string): Promise<UserEntity | null> {
    const userDoc = await this.model.findOne({ [field]: value });
    if (!userDoc) return null;
    return this.mapper.toDomain(userDoc);
  }

  async verifyEmail(email: string): Promise<UserEntity | null> {
    const userDoc = await this.model.findOneAndUpdate(
      { email },
      { $set: { isEmailVerified: true } },
      { new: true },
    );
    if (!userDoc) return null; 
    return this.mapper.toDomain(userDoc);
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { $set: { password } });
  }

  async findWithFilters(options: QueryOptions): Promise<UserEntity[]> {
    const {
      page = 1,
      limit = 10,
      filter = {},
      search = "",
      searchField = ["fullName", "email", "userCode"],
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const skip = (page - 1) * limit;

    type UserFilter = Record<string, unknown> & {
      $or?: Array<Record<string, unknown>>;
    };

    const finalFilter: UserFilter = { ...filter };

    if (search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      finalFilter.$or = searchField.map((field: string) => ({
        [field]: searchRegex,
      }));
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const docs = await this.model
      .find(finalFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return Promise.all(docs.map((doc) => this.mapper.toDomain(doc)));
  }

  async CountActiveUsers(): Promise<{ totalActiveUsersCount: number; }> {
    const totalActiveUsersCount = await this.model.countDocuments({ isBlocked: false });
    return { totalActiveUsersCount };
  }

  async CountInActiveUsers(): Promise<{ totalInActiveUsersCount: number; }> {
    const totalInActiveUsersCount = await this.model.countDocuments({ isBlocked: true });
    return { totalInActiveUsersCount }
  }

  async CountVerifiedUsers(): Promise<{ totalVerifiedUsersCount: number; }> {
    const totalVerifiedUsersCount = await this.model.countDocuments({ isVerified: true });
    return { totalVerifiedUsersCount }
  }

  async findAllWithRelations(userId: string): Promise<UserEntity | null> {
    const user = await this.model
      .findById(userId)
      .populate("kycId")
      .populate("walletId")
      .exec();

    if (!user) return null; 
    return this.mapper.toDomain(user);
  }
}
