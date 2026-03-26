import { Trade } from "@application/dto/stocks/stock.dto";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { inject, injectable } from "inversify";
import { emitStockUpdate } from "@infrastructure/providers/notification/socket.configs";

@injectable()
export class MarketDataProvider implements IMarketDataProvider {
    private isInitialized = false;

    constructor(
        @inject(STOCK_TYPES.StockWebSocketClient) private readonly websocketClient: IStockWebsocketProvider,
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly redis: ICacheProvider,
    ) { }

    start(symbol: string[]) {
        if (!this.isInitialized) {
            this.websocketClient.connect();
            this.websocketClient.onTrade((trade) => {
                this.handleCache(trade);
            });
            this.isInitialized = true;
        }

        symbol.forEach(s => this.websocketClient.subscribe(s));
    }

    async getLatestPrices(symbols: string[]): Promise<Record<string, number>> {
        const prices: Record<string, number> = {};
        const fetchPromises = symbols.map(async (symbol) => {
            const cachedPrice = await this.redis.get(`stock:${symbol}:latest`);
            if (cachedPrice) {
                prices[symbol] = parseFloat(cachedPrice);
            }
        });
        await Promise.all(fetchPromises);
        return prices;
    }

    private async handleCache(trade: Trade) {
        // 1. store latest price in Redis
        const ttl = 3600;
        await this.redis.set(`stock:${trade.symbol}:latest`, String(trade.price), ttl);

        // 2. push to frontend
        emitStockUpdate(trade);

        // (later) 3. candle aggregation
    }
}