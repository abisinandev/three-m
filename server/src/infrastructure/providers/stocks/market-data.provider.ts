import { Trade } from "@application/dto/stocks/stock.dto";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { inject, injectable } from "inversify";
import { emitStockUpdate } from "@infrastructure/providers/notification/socket.configs";
import { FinnhubService } from "./finnhub.service";

@injectable()
export class MarketDataProvider implements IMarketDataProvider {
    private isInitialized = false;
    private subscribed = new Set<string>();

    constructor(
        @inject(STOCK_TYPES.StockWebSocketClient) private readonly websocketClient: IStockWebsocketProvider,
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly redis: ICacheProvider,
        @inject(STOCK_TYPES.FinnhubService) private readonly finnhubService: FinnhubService
    ) { }

    init() {
        if (this.isInitialized) return;

        this.websocketClient.connect();
        this.websocketClient.onTrade((trade) => this.handleTrade(trade));
        this.isInitialized = true;
    }

    subscribe(symbols: string[]) {
        symbols.forEach(symbol => {
            if (this.subscribed.has(symbol)) return;

            this.websocketClient.subscribe(symbol);
            this.subscribed.add(symbol);
        });
    }

    async getLatestPrices(symbols: string[]): Promise<Record<string, number>> {
        const prices: Record<string, number> = {};
        const missing: string[] = [];

        await Promise.all(symbols.map(async (symbol) => {
            const cached = await this.redis.get(`stock:${symbol}:latest`);

            if (cached) {
                prices[symbol] = parseFloat(cached);
            } else {
                missing.push(symbol);
            }
        }));

        if (missing.length) {
            await Promise.all(missing.map(async (symbol) => {
                const price = await this.finnhubService.getQuote(symbol);

                if (price) {
                    prices[symbol] = price;
                    await this.redis.set(`stock:${symbol}:latest`, String(price), 300);
                }
            }));
        }

        return prices;
    }

    private async handleTrade(trade: Trade) {
        await this.redis.set(`stock:${trade.symbol}:latest`, String(trade.price), 3600);
        emitStockUpdate(trade);
    }
}