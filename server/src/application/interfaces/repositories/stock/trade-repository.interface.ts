import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { IBaseRepository } from "../base-repository.interface";
import { ClientSession } from "mongoose";

export interface TradeFilterOptions {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filter?: Record<string, unknown>;
}

export interface ITradeRepository extends IBaseRepository<TradeEntity> {
    findByUserId(userId: string, session?: ClientSession): Promise<TradeEntity[]>;
    findByOrderId(orderId: string, session?: ClientSession): Promise<TradeEntity[]>;
    countTodaysTrades(): Promise<number>;
    findWithFilters(userId: string, options: TradeFilterOptions): Promise<TradeEntity[]>;
    countWithFilters(userId: string, filter: Record<string, unknown>, search: string): Promise<number>;
    findAlgoTradesWithFilter(options: TradeFilterOptions): Promise<TradeEntity[]>;
    countAlgoTrades(search?: string): Promise<number>;
    countDailyAlgoTradesByStrategy(strategyName: string): Promise<number>;
}
