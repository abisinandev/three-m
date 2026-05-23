import { inject, injectable } from "inversify";
import { IAdminGetAlgoTradesUseCase } from "./interfaces/admin-get-algo-trades-usecase.interface";
import { QueryOptions } from "mongoose";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { FetchDataResponseDTO } from "@application/dto/admin/fetch-data.response.dto";
import { AdminAlgoTradeResponseDTO } from "@application/dto/admin/algo-trading/algo-trade-response.dto";

@injectable()
export class AdminGetAlgoTradesUseCase implements IAdminGetAlgoTradesUseCase {

    constructor(
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
    ) { }

    async execute(query: QueryOptions): Promise<FetchDataResponseDTO<AdminAlgoTradeResponseDTO>> {
        const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = query;

        const trades = await this._tradeRepository.findAlgoTradesWithFilter({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
        });

        const totalCount = await this._tradeRepository.countAlgoTrades(search);

        const data: AdminAlgoTradeResponseDTO[] = trades.map(entity => ({
            id: entity.id as string,
            userId: entity.userId,
            orderId: entity.orderId,
            symbol: entity.symbol,
            side: entity.side,
            quantity: entity.quantity,
            price: entity.price,
            profit: entity.profit,
            createdAt: entity.createdAt,
        }));

        return {
            data,
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
        };
    }
}
