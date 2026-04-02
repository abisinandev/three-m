import { ICandleEngineService } from '@application/interfaces/services/stocks/candle-chart-service.interface';
import { IPollingService } from '@application/interfaces/services/stocks/polling-service.interface';
import { IYahooProvider } from '@application/interfaces/services/stocks/yahoo-provider.interface';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { injectable, inject } from 'inversify';
import { TimeframeAggregatorService } from './timeframe-aggregator.service';


@injectable()
export class PollingService implements IPollingService{
    private activeSymbols: Set<string> = new Set();
    private intervalId: NodeJS.Timeout | null = null;
    
    constructor(
        @inject(STOCK_TYPES.YahooProvider) private readonly yahooProvider: IYahooProvider,
        @inject(STOCK_TYPES.CandleEngineService) private readonly candleEngine: ICandleEngineService,
        @inject(STOCK_TYPES.TimeframeAggregatorService) private readonly timeframeAggregator: TimeframeAggregatorService
    ) {}

    start() {
        if (this.intervalId) return;

        console.log('[PollingService] Started Yahoo Finance Polling');

        this.intervalId = setInterval(async () => {
            if (this.activeSymbols.size === 0) return;

            const promises = Array.from(this.activeSymbols).map(async (symbol) => {
                try {
                    const quote = await this.yahooProvider.getLatestQuote(symbol);
                    if (quote) {
                        this.candleEngine.processTick({
                            symbol,
                            price: quote.price,
                            timestamp: quote.timestamp
                        }); 
                    }
                } catch (e) { 
                    console.error(`[PollingService] Polling error for ${symbol}`, e);
                }
            });

            await Promise.all(promises);

        }, 3000); 
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    addSymbol(symbol: string) {
        if (!this.activeSymbols.has(symbol)) {
            console.log(`[PollingService] Added ${symbol} to polling watch list`);
            this.activeSymbols.add(symbol);
        }
    }

    removeSymbol(symbol: string) {
        this.activeSymbols.delete(symbol);
    }
}
