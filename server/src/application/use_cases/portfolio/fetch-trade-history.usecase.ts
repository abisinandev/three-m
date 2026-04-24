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
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const { page = 1, limit = 10, search = "" } = options;

        const [trades, total] = await Promise.all([
            this._tradeRepository.findWithFilters(userId, options),
            this._tradeRepository.countWithFilters(userId, {}, search as string)
        ]);

        return {
            data: trades,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / (Number(limit) || 10)),
        };
    }
}
