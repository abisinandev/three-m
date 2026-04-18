import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { IStrategyService } from "@application/interfaces/services/algo-trading/strategy-service.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { inject, injectable } from "inversify";
import { StrategyRegistry } from "../strategy-registry";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";

type StrategyName = keyof typeof StrategyRegistry;

@injectable()
export class StrategyService implements IStrategyService {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly _strategyRepository: IAlgoStrategyRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketData: IMarketDataProvider,
    ) { }

    async evaluateStrategy(strategyId: string) {
        const s = await this._strategyRepository.findById(strategyId);
        if (!s || !s.isActive) return null;

        const { symbol, strategyName, config } = s;

        const now = Math.floor(Date.now() / 1000);
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

        const candles = await this._marketData.getHistoricalData({
            symbol,
            period1: thirtyDaysAgo,
            period2: now,
            interval: '1m'
        });

        if (!candles || candles.length < 20) return null;

        const closedCandles = candles.slice(0, -1);
        const priceHistory = closedCandles.map(c => c.close);
        const currentPrice = priceHistory[priceHistory.length - 1];

        const strategy = StrategyRegistry[strategyName as StrategyName];
        if (!strategy) return null;

        const result = strategy.evaluate({
            symbol,
            priceHistory,
            config
        });

        if (!result) return null;

        return {
            userId: s.userId,
            symbol,
            strategyName,
            action: result.action,
            price: currentPrice,
            reason: result.reason,
            algoId: strategyId
        };
    }
}