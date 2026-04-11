import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { BaseRepository } from "../base.repository";
import { TradeDocument, TradeModel } from "@infrastructure/databases/mongo_db/models/schemas/stock/trade.schema";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
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
}
