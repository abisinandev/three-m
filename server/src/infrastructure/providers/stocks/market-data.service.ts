import { injectable, inject } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { Trade } from "@application/dto/stocks/stock.dto";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { WsGateway } from "@presentation/express/websocket/ws.gateway";

import { ICandle } from "@infrastructure/providers/stocks/market-data/interfaces/candle.interface";
import { CandleEngineService } from "./market-data/services/candle-engine.service";
import { TimeframeAggregatorService } from "./market-data/services/timeframe-aggregator.service";
import { PollingService } from "./market-data/services/polling.service";
import { CandleMapper } from "@application/mappers/stock/candle.mapper";

@injectable()
export class MarketDataService {
    constructor(
        @inject(STOCK_TYPES.StockWebSocketClient) private readonly websocketClient: IStockWebsocketProvider,
        @inject(STOCK_TYPES.CandleEngineService) private readonly candleEngine: CandleEngineService,
        @inject(STOCK_TYPES.TimeframeAggregatorService) private readonly timeframeAggregator: TimeframeAggregatorService,
        @inject(STOCK_TYPES.PollingService) private readonly pollingService: PollingService,
    ) {}

    private wsGateway!: WsGateway;

    public setWsGateway(wsGateway: WsGateway) {
        this.wsGateway = wsGateway;
    }

    public init() {
        // 1. Real-time (WS) Stream
        this.websocketClient.onTrade((trade: Trade) => {
            this.candleEngine.processTrade(trade);
        });

        // 2. Candle Pipeline Subscriptions
        
        // Listen to all 1m candle updates (both WS and Polling)
        this.candleEngine.onCandleUpdate((candle: ICandle) => {
            this.broadcastCandle(candle);
        });

        // When a 1m candle completes, feed it to the HTF aggregator
        this.candleEngine.onCandleComplete((candle: ICandle) => {
            this.timeframeAggregator.process1mCandle(candle);
        });

        // Listen to all Higher Timeframe (5m, 15m, 1h) updates
        this.timeframeAggregator.onCandleUpdate((candle: ICandle) => {
            this.broadcastCandle(candle);
        });

        this.pollingService.start();
    }

    private broadcastCandle(candle: ICandle) {
        if (!this.wsGateway) return;

        // Map to Domain Entity for proper abstraction
        const candleEntity = CandleMapper.toEntity(candle);
        
        this.wsGateway.broadcastToSubscribers(candleEntity);
    }

    public subscribeToSymbol(symbol: string) {
        console.log(`[MarketDataService] Subscribing to ${symbol}`);
        this.pollingService.addSymbol(symbol);
        this.websocketClient.subscribe(symbol);
    }

    public unsubscribeFromSymbol(symbol: string) {
        console.log(`[MarketDataService] Unsubscribing from ${symbol}`);
        this.pollingService.removeSymbol(symbol);
        this.websocketClient.unsubscribe(symbol);
    }
}
