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
}
