import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { QueryOptions } from "mongoose";

export interface IFetchTradeHistoryUseCase {
    execute(userId: string, options: QueryOptions): Promise<{
        data: any[];
        totalCount: number;
        page: number;
        limit: number;
    }>;
}
