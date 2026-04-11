import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";
import { QueryOptions } from "mongoose";
import { BaseRepository } from "../base.repository";
import { AlgoStrategyDocument, AlgoStrategyModel } from "@infrastructure/databases/mongo_db/models/schemas/algo-trading/algo-strategy.schema";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { AlgoStrategyMapper } from "@infrastructure/mappers/algo/algo-strategy.mapper";

export class AlgoStrategyRepository extends
    BaseRepository<AlgoStrategyEntity, AlgoStrategyDocument> implements IAlgoStrategyRepository {

    constructor() {
        super(AlgoStrategyModel, AlgoStrategyMapper)
    }

    async getAllActive(): Promise<AlgoStrategyEntity[]> {
        const docs = await AlgoStrategyModel.find({ isActive: true });
        return docs.map((doc: AlgoStrategyDocument) => AlgoStrategyMapper.toDomain(doc));
    }

    async findWithFilters(options: QueryOptions): Promise<AlgoStrategyEntity[]> {
        const {
            page = 1,
            limit = 10,
            filter = {},
            search = "",
            searchField = ["strategyName", "symbol"],
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const skip = (page - 1) * limit;

        type StrategyFilter = Record<string, unknown> & {
            $or?: Array<Record<string, unknown>>;
        };

        const finalFilter: StrategyFilter = { ...filter };

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

        return docs.map((doc) => this.mapper.toDomain(doc));
    }

    async countActiveStrategies(): Promise<number> {
        return this.model.countDocuments({ isActive: true }).exec();
    }
}
