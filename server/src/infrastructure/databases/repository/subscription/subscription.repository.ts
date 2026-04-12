import { SubscriptionEntity } from "@domain/entities/subscription/subscription.entity";
import { BaseRepository } from "../base.repository";
import { SubscriptionDocument, SubscriptionModel } from "@infrastructure/databases/mongo_db/models/schemas/subscriptions/subscription.schema";
import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { SubscriptionMapper } from "@infrastructure/mappers/subscription/subscription.mapper";
import { FilterQuery, QueryOptions } from "mongoose";
import { injectable } from "inversify";
import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";

@injectable()
export class SubscriptionRepository extends
    BaseRepository<SubscriptionEntity, SubscriptionDocument> implements ISubscriptionRepository {

    constructor() {
        super(SubscriptionModel, SubscriptionMapper)
    }

    async findWithFilters(options: QueryOptions): Promise<SubscriptionEntity[]> {
        const {
            page = 1,
            limit = 10,
            filter = {},
            search = "",
            searchField = ["userId", "plans"],
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const skip = (page - 1) * limit;

        const finalFilter: FilterQuery<SubscriptionDocument> = { ...filter };

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

    async count(filter: FilterQuery<unknown> = {}): Promise<{ totalCount: number }> {
        const totalCount = await this.model.countDocuments(filter);
        return { totalCount };
    }


    async totalRevenue(): Promise<{ totalRevenue: number; }> {
        const now = new Date();
        const result = await this.model.aggregate([
            {
                $match: {
                    status: SubscriptionStatus.ACTIVE,
                    endDate: { $gt: now }
                }
            },
            {
                $lookup: {
                    from: "plans",
                    localField: "plans",
                    foreignField: "code",
                    as: "planData"
                }
            },
            { $unwind: "$planData" },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$planData.price" }
                }
            }
        ]);

        return { totalRevenue: result[0]?.total || 0 };
    }


    async recentSubscribers(): Promise<SubscriptionEntity[] | null> {
        const docs = await this.model
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .exec();

        if (!docs || docs.length === 0) return null;

        return Promise.all(docs.map(doc => this.mapper.toDomain(doc)));
    }

    async activeSubs(): Promise<SubscriptionEntity[]> {
        const docs = await this.model.find({
            status: SubscriptionStatus.ACTIVE,
            endDate: { $gt: new Date() }
        }).exec();

        return Promise.all(docs.map(doc => this.mapper.toDomain(doc)));
    }
}