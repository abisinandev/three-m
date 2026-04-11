import { inject, injectable } from "inversify";
import { IAdminAlgoTradingUseCase } from "./interfaces/admin-algo-trading-usecaes.interface";
import { AdminAlgoTradingResponseDTO } from "@application/dto/admin/algo-trading/admin-algo-trading-response.dto";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";

@injectable()
export class AdminAlgoTradingUseCase implements IAdminAlgoTradingUseCase {

    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly _strategyRepo: IAlgoStrategyRepository,
        @inject(STOCK_TYPES.AlgoSignalRepository) private readonly _signalRepo: IAlgoSignalRepository,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepo: ITradeRepository,
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepo: IOrderRepository,
    ) { }

    async execute(): Promise<AdminAlgoTradingResponseDTO> {

        const activeStrategiesCount = await this._strategyRepo.countActiveStrategies();

        const activeSignalsCount = await this._signalRepo.countSignals();

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const tradesExecutedTodayCount = await this._tradeRepo.countTodaysTrades();

        const failedTradesCount = await this._orderRepo.countCancelledOrders();

        return {
            activeStrategiesCount,
            activeSignalsCount,
            tradesExecutedTodayCount,
            failedTradesCount,
            marketStatus: "OPEN"
        };
    }
}