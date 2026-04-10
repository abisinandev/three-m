import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { IStrategyService } from "@application/interfaces/services/algo-trading/strategy-service.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { inject, injectable } from "inversify";
import { StrategyRegistry } from "./strategy-registry";
import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { ISignalService } from "@application/interfaces/services/algo-trading/signal.service.interface";
import { SignalAction } from "@domain/entities/algo/enum/signal-enums";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";

type StrategyName = keyof typeof StrategyRegistry;

export interface IUserStrategy {
    userId: string;
    symbol: string;
    strategyName: StrategyName;
    config: Record<string, any>;
}

@injectable()
export class StrategyService implements IStrategyService {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly _strategyRepository: IAlgoStrategyRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketData: IMarketDataProvider,
        @inject(STOCK_TYPES.SignalService) private readonly _signalService: ISignalService,

    ) { }

    async run(): Promise<void> {
        const strategies = await this._strategyRepository.getAllActive();

        if (!strategies.length) return;

        for (const strategy of strategies) {
            await this.processStrategy(strategy);
        }
    }

    private async processStrategy(s: AlgoStrategyEntity) {
        const { userId, symbol, strategyName, config } = s;
        const algoId = s.id as string;

        const now = Math.floor(Date.now() / 1000);
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

        const priceHistory = await this._marketData.getPriceHistory({
            symbol,
            period1: thirtyDaysAgo,
            period2: now,
            interval: '1m'
        });

        if (!priceHistory || priceHistory.length < 20) return;

        const currentPrice = priceHistory[priceHistory.length - 1];

        const strategy = StrategyRegistry[strategyName as StrategyName];
        if (!strategy) return;

        const result = strategy.evaluate({
            symbol, 
            priceHistory,
            config
        });
        console.log("Algo result: ", result);

        if (!result) return;

        await this._signalService.createSignal({
            userId,
            symbol,
            strategyName,
            action: result.action === 'BUY' ? SignalAction.BUY : SignalAction.SELL,
            algoId,
            price: currentPrice,
            reason: result.reason,
        })
    }
}