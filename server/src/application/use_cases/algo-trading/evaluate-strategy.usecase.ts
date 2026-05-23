import { inject, injectable } from "inversify";
import { IEvaluateStrategyUseCase } from "./interfaces/evaluate-strategy.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { StrategyRegistry } from "@infrastructure/providers/algos/strategy-registry";
import { SignalAction } from "@domain/entities/algo/enum/signal-enums";

type StrategyName = keyof typeof StrategyRegistry;

@injectable()
export class EvaluateStrategyUseCase implements IEvaluateStrategyUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly _strategyRepository: IAlgoStrategyRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketData: IMarketDataProvider,
    ) { }

    async execute(strategyId: string): Promise<{
        userId: string;
        symbol: string;
        strategyName: string;
        action: SignalAction;
        price: number;
        reason: string;
    } | null> {
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

        const closedCandles = candles.slice(0, -1); // ignoring current candle
        const priceHistory = closedCandles.map(c => c.close);
        const currentPrice = priceHistory[priceHistory.length - 1];

        const strategy = StrategyRegistry[strategyName as StrategyName];
        if (!strategy) return null;

        const result = await strategy.evaluate({
            symbol,
            priceHistory,
            config
        });

        if (!result) return null;

        return {
            userId: s.userId,
            symbol,
            strategyName,
            action: result.action as SignalAction,
            price: currentPrice,
            reason: result.reason,
            // algoId: strategyId
        };
    }
}
