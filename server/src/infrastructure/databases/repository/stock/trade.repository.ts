import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { BaseRepository } from "../base.repository";
import { TradeDocument, TradeModel } from "@infrastructure/databases/mongo_db/models/schemas/stock/trade.schema";
import { ITradeRepository, TradeFilterOptions } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { TradeMapper } from "@infrastructure/mappers/stock/trade.mapper";
import { ClientSession } from "mongoose";
import { injectable } from "inversify";

@injectable()
export class TradeRepository extends BaseRepository<TradeEntity, TradeDocument> implements ITradeRepository {
    constructor() {
        super(TradeModel, TradeMapper);
    }


    async findByUserId(userId: string, session?: ClientSession): Promise<TradeEntity[]> {
        const query = this.model.find({ userId }).sort({ createdAt: -1 });
        if (session) query.session(session);
        const docs = await query.exec();
        return docs.map(doc => TradeMapper.toDomain(doc));
    }

    async findByOrderId(orderId: string, session?: ClientSession): Promise<TradeEntity[]> {
        const query = this.model.find({ orderId }).sort({ createdAt: -1 });
        if (session) query.session(session);
        const docs = await query.exec();
        return docs.map(doc => TradeMapper.toDomain(doc));
    }

    async findWithFilters(userId: string, options: TradeFilterOptions): Promise<TradeEntity[]> {
        const {
            page = 1,
            limit = 10,
            filter = {},
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const skip = (Number(page) - 1) * Number(limit);

        const finalFilter: Record<string, unknown> = {
            ...filter,
            userId: userId as unknown
        };

        if (search.trim()) {
            finalFilter.$or = [
                { symbol: { $regex: search.trim(), $options: "i" } },
                { userId: { $regex: search.trim(), $options: "i" } }
            ];
        }

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        } as unknown;

        const docs = await this.model
            .find(finalFilter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .exec();

        return docs.map(doc => TradeMapper.toDomain(doc));
    }

    async countWithFilters(userId: string, filter: Record<string, unknown>, search: string): Promise<number> {
        const finalFilter: Record<string, unknown> = {
            ...filter,
            userId: userId as unknown
        };

        if (search.trim()) {
            finalFilter.$or = [
                { symbol: { $regex: search.trim(), $options: "i" } },
                { userId: { $regex: search.trim(), $options: "i" } }
            ];
        }

        return await this.model.countDocuments(finalFilter);
    }

    async countTodaysTrades(): Promise<number> {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        return this.model.countDocuments({ createdAt: { $gte: startOfToday } }).exec();
    }

    async findAlgoTradesWithFilter(options: TradeFilterOptions): Promise<TradeEntity[]> {
        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const skip = (page - 1) * limit;
        const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

        const matchStage: Record<string, unknown> = { isAlgoTrade: true };

        if (search) {
            matchStage["$or"] = [
                { symbol: { $regex: search, $options: "i" } },
                { userId: { $regex: search, $options: "i" } },
                { side: { $regex: search, $options: "i" } },
            ];
        }

        const docs = await this.model
            .find(matchStage)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();

        return docs.map(doc => TradeMapper.toDomain(doc));
    }

    async countAlgoTrades(search = ""): Promise<number> {
        const matchStage: Record<string, unknown> = { isAlgoTrade: true };

        if (search) {
            matchStage["$or"] = [
                { symbol: { $regex: search, $options: "i" } },
                { userId: { $regex: search, $options: "i" } },
                { side: { $regex: search, $options: "i" } },
            ];
        }

        return this.model.countDocuments(matchStage).exec();
    }


    async countDailyAlgoTradesByStrategy(strategyName: string): Promise<number> {
        return 0
    }

    async calculateTotalAlgoAUM(): Promise<number> {
        const result = await this.model.aggregate([
            { $match: { isAlgoTrade: true } },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $cond: [{ $eq: ["$side", "BUY"] }, { $multiply: ["$price", "$quantity"] }, { $multiply: ["$price", "$quantity", -1] }]
                        }
                    }
                }
            }
        ]);
        return result.length > 0 ? Math.max(0, result[0].total) : 0;
    }
}
