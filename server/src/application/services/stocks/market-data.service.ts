import { injectable, inject } from "inversify";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { CandleBuilderService } from "./candle-builder.service";
import { TimeframeAggregatorService } from "./timeframe-aggregator.service";
import { Trade } from "@application/dto/stocks/stock.dto";
// Since IMarketDataProvider expects getLatestPrices and doesn't exactly have an onTrade out of the box natively on its interface, we may need to use MarketDataProvider directly or enhance interface.
// Because it's a provider array, I'll inject the stock websocket directly or MarketDataProvider.
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { WsGateway } from "@presentation/express/websocket/ws.gateway";
import { Candle } from "@domain/entities/stock/candle.entity";

@injectable()
export class MarketDataService {
    constructor(
        // We inject the websocket provider to get trades directly, 
        // or we could rely on MarketDataProvider. For now, since MarketDataProvider orchestrates cache, we use websocket to get raw trades.
        @inject(STOCK_TYPES.StockWebSocketClient) private readonly websocketClient: IStockWebsocketProvider,
        @inject(STOCK_TYPES.CandleBuilderService) private readonly candleBuilder: CandleBuilderService,
        @inject(STOCK_TYPES.TimeframeAggregatorService) private readonly timeframeAggregator: TimeframeAggregatorService,
        // We defer injecting WsGateway to DI setup or singleton
    ) {}

    private wsGateway!: WsGateway;

    // Separate initialization to break potential circular dependencies if WsGateway needs this service
    public setWsGateway(wsGateway: WsGateway) {
        this.wsGateway = wsGateway;
    }

    public init() {
        this.websocketClient.onTrade((trade: Trade) => {
            this.candleBuilder.processTrade(trade);
            this.timeframeAggregator.processTrade(trade);
        });

        // 1m candle updates (partial)
        this.candleBuilder.onCandleUpdate((candle: Candle) => {
            this.broadcastCandle(candle);
        });

        // 1m candle completion
        // No longer needed: TimeframeAggregator builds directly from trades now.
        // this.candleBuilder.onCandleCompleted((candle: Candle) => {
        //     this.timeframeAggregator.process1mCandle(candle);
        // });

        // HTF candle updates (partial)
        this.timeframeAggregator.onCandleUpdate((candle: Candle) => {
             this.broadcastCandle(candle);
        });
        
        // We can listen to HTF completion if needed, but it's already broadcasted by update and saved to Redis by aggregator.
    }

    private broadcastCandle(candle: Candle) {
        if (!this.wsGateway) return;

        // Broadcast to clients subscribed to this symbol and timeframe
        this.wsGateway.broadcastToSubscribers(candle);
    }
}
