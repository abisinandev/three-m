import { PlanEntity } from "@domain/entities/subscription/plan.entity";
import { BaseRepository } from "../base.repository";
import { PlanDocument, PlanModel } from "@infrastructure/databases/mongo_db/models/schemas/subscriptions/plans-schema";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { PlanMapper } from "@infrastructure/mappers/subscription/plan.mapper";
import { FilterQuery, QueryOptions } from "mongoose";
import { injectable } from "inversify";

@injectable()
export class PlanRepository extends BaseRepository<PlanEntity, PlanDocument>
    implements IPlanRepository {

    constructor() {
        super(PlanModel, PlanMapper)
    }

    async findWithFilters(options: QueryOptions): Promise<PlanEntity[]> {
        const {
            page = 1,
            limit = 10,
            filter = {},
            search = "",
            searchField = ["code"],
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const skip = (page - 1) * limit;

        const finalFilter: FilterQuery<PlanDocument> = { ...filter };

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

    async findPlans(): Promise<PlanEntity[] | null> {
        const docs = await this.model.find();
        if (!docs) return null;
        return docs.map(doc => this.mapper.toDomain(doc));
    }
}