import { inject, injectable } from "inversify";
import { IFetchTradeHistoryUseCase } from "./interfaces/fetch-trade-history-usecase.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { QueryOptions } from "mongoose";
import { TradeEntity } from "@domain/entities/stock/trade.entity";

@injectable()
export class FetchTradeHistoryUseCase implements IFetchTradeHistoryUseCase {
    constructor(
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
    ) { }

    async execute(userId: string, options: QueryOptions): Promise<{
        data: TradeEntity[];
        totalCount: number;
        page: number;
        limit: number;
    }> {
        const { page = 1, limit = 10 } = options;

        const allTrades = await this._tradeRepository.findByUserId(userId);

        const start = (Number(page) - 1) * Number(limit);
        const end = start + Number(limit);

        const sortedTrades = allTrades.sort((a, b) =>
            new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime()
        );

        return {
            data: sortedTrades.slice(start, end).map(t => t),
            totalCount: allTrades.length,
            page: Number(page),
            limit: Number(limit),
        };
    }
}
