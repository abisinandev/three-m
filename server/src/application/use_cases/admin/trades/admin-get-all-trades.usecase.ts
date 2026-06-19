import { FetchDataResponseDTO } from "@application/dto/admin/fetch-data.response.dto";
import { AdminTradeResponseDTO } from "@application/dto/admin/trades/admin-trade-response.dto";
import { QueryOptions } from "mongoose";
import { IAdminGetAllTradesUseCase } from "./interfaces/admin-get-all-trades-usecase.interface";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";

@injectable()
export class AdminGetAllTradesUseCase implements IAdminGetAllTradesUseCase {
    constructor(
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
    ) { }

    async execute(query: QueryOptions): Promise<FetchDataResponseDTO<AdminTradeResponseDTO>> {
        const { page = 1, limit = 10, search = "", type = "All" } = query;

        const filter: Record<string, unknown> = {};
        if (type === "Algo") {
            filter.isAlgoTrade = true;
        } else if (type === "Manual") {
            filter.isAlgoTrade = { $ne: true };
        }

        const trades = await this._tradeRepository.findAllTradesWithFilter({
            page: Number(page),
            limit: Number(limit),
            search: String(search),
            filter
        });
        
        const total = await this._tradeRepository.countAllTrades(String(search));

        return {
            data: trades.map(trade => ({
                id: String(trade.id).slice(17).toUpperCase(),
                userId: String(trade.userId).slice(17).toUpperCase(),
                orderId: String(trade.orderId).slice(17).toUpperCase(),
                symbol: trade.symbol,
                side: trade.side,
                quantity: trade.quantity,
                price: trade.price,
                isAlgoTrade: trade.isAlgoTrade,
                createdAt: trade.createdAt
            })),
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
        };
    }
}
