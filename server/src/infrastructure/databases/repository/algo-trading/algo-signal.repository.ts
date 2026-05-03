import { AlgoSignalEntity } from "@domain/entities/algo/algo-signal.entity";
import { BaseRepository } from "../base.repository";
import { AlgoSignalDocument, AlgoSignalModel } from "@infrastructure/databases/mongo_db/models/schemas/algo-trading/algo-signal.schema";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { AlgoSignalMapper } from "@infrastructure/mappers/algo/algo-signal.mapper";
import { QueryOptions } from "mongoose";

export class AlgoSignalRepository extends
    BaseRepository<AlgoSignalEntity, AlgoSignalDocument> implements IAlgoSignalRepository {

    constructor() {
        super(AlgoSignalModel, AlgoSignalMapper)
    }

    async create(signal: AlgoSignalEntity): Promise<AlgoSignalEntity> {
        const data = this.mapper.toPersistance(signal);
        const doc = await this.model.create(data);
        return this.mapper.toDomain(doc)
    }

    async existsRecentSignal(userId: string, symbol: string, action: string, cooldownMinutes: number = 30): Promise<boolean> {
        const lookback = new Date(Date.now() - cooldownMinutes * 60 * 1000);
        const latestSignal = await AlgoSignalModel.findOne({
            userId,
            symbol,
            // algoId,
            createdAt: { $gte: lookback }
        }).sort({ createdAt: -1 });

        if (latestSignal && latestSignal.action === action) {
            return true;
        }
        return false;
    }

    async getLastSignalAction(userId: string, symbol: string): Promise<string | null> {
        const latestSignal = await AlgoSignalModel.findOne({
            userId,
            symbol,
        }).sort({ createdAt: -1 });

        return latestSignal ? latestSignal.action : null;
    }

    async findAllSignalsWithFilter(query: QueryOptions): Promise<AlgoSignalEntity[]> {
        const {
            page = 1,
            limit = 10,
            filter = {},
            search = "",
            searchField = ["action", "symbol", "status"],
            sortBy = "createdAt",
            sortOrder = "desc",
        } = query;

        const skip = (page - 1) * limit;

        type SignalFilter = Record<string, unknown> & {
            $or?: Array<Record<string, unknown>>;
        };

        const finalFilter: SignalFilter = { ...filter };

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

    async countSignals(): Promise<number> {
        return this.model.countDocuments().exec();
    }

    async countApprovedDailySignalsByStrategy(strategyName: string): Promise<number> {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        return await this.model.countDocuments({
            strategyName,
            status: 'APPROVED',
            createdAt: { $gte: startOfToday }
        }).exec();
    }

} 