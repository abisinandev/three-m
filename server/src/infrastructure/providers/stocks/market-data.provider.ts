import { Trade } from "@application/dto/stocks/stock.dto";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { inject, injectable } from "inversify";

@injectable()
export class MarketDataProvider implements IMarketDataProvider {

    constructor(
        @inject(STOCK_TYPES.StockWebSocketClient) private readonly websocketClient: IStockWebsocketProvider,
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly redis: ICacheProvider,
    ) { }

    start(symbol: string[]) {

        this.websocketClient.connect();

        symbol.forEach(s => this.websocketClient.subscribe(s));

        this.websocketClient.onTrade((trade) => {
            this.handleCache(trade);
        })
    }


    private async handleCache(trade: Trade) {
        // 1. store latest price in Redis
        const ttl = 3600;
        await this.redis.set(`stock:${trade.symbol}:latest`, String(trade.price), ttl);

        // 2. push to frontend
        // this.socket.broadcast("price_update", trade);

        // (later) 3. candle aggregation
    }
}