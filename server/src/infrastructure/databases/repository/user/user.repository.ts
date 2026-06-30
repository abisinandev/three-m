import type { UserEntity } from "@domain/entities/user/user.entity";
import {
  type UserDocument,
  UserModel,
} from "@infrastructure/databases/mongo_db/models/schemas/user/user.schema";
import { UserMapper } from "@infrastructure/mappers/user/user.mapper";
import { injectable } from "inversify";
import type { QueryOptions } from "mongoose";
import { BaseRepository } from "../base.repository";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

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
  };

  async CountActiveUsers(): Promise<{ totalActiveUsersCount: number; }> {
    const totalActiveUsersCount = await this.model.countDocuments({ isBlocked: false });
    return { totalActiveUsersCount };
  };

  async CountInActiveUsers(): Promise<{ totalInActiveUsersCount: number; }> {
    const totalInActiveUsersCount = await this.model.countDocuments({ isBlocked: true });
    return { totalInActiveUsersCount }
  };

  async CountVerifiedUsers(): Promise<{ totalVerifiedUsersCount: number; }> {
    const totalVerifiedUsersCount = await this.model.countDocuments({ isVerified: true });
    return { totalVerifiedUsersCount }
  };


  async getTotalUsersCount(): Promise<number> {
    return this.model.countDocuments({});
  }

  async getPremiumUsersCount(): Promise<number> {
    return this.model.countDocuments({
      subscriptionStatus: "ACTIVE",
      subscriptionPlan: "PREMIUM"
    });
  }

  async getUserRegistrationGrowthByMonth(months: number): Promise<{ month: string; users: number; premium: number }[]> {
    const date = new Date();
    date.setMonth(date.getMonth() - months);

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: date }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          users: { $sum: 1 },
          premium: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$subscriptionStatus", "ACTIVE"] }, { $eq: ["$subscriptionPlan", "PREMIUM"] }] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } as Record<string, 1 | -1> }
    ];

    const result = await this.model.aggregate(pipeline);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return result.map((item: { _id: { month: number }; users: number; premium: number }) => ({
      month: monthNames[item._id.month - 1],
      users: item.users,
      premium: item.premium
    }));
  }

  async updateSubscriptionData(
    userId: string,
    data: { subscriptionStatus: string; subscriptionPlan: string; subscriptionId?: string | null }
  ): Promise<void> {

    const res = await this.model.updateOne(
      { _id: userId },
      {
        $set: {
          subscriptionStatus: data.subscriptionStatus,
          subscriptionPlan: data.subscriptionPlan,
        }
      }
    );
    console.log('updateSubscriptionData: ', res);
  }
}
