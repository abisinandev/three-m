import { injectable, inject } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { Trade } from "@application/dto/stocks/stock.dto";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { CandleMapper } from "@application/mappers/stock/candle.mapper";
import { ICandle } from "@infrastructure/databases/mongo_db/models/interfaces/stocks/stock-candle-schema.interface";
import { ICandleEngineService } from "@application/interfaces/services/stocks/candle-engine-service.interface";
import { ITimeframeAggregatorService } from "@application/interfaces/services/stocks/timeframe-aggragator.interface";
import { IPollingService } from "@application/interfaces/services/stocks/polling-service.interface";
import { IMarketDataService } from "@application/interfaces/services/stocks/market-data-service.usecase";
import { IWsGateway } from "@application/interfaces/services/stocks/ws-gateway.interface";

/**
 * Manages the end-to-end flow of market data.
 *
 * - Receives trades and builds 1-minute candles
 * - Aggregates them into higher timeframes
 * - Broadcasts all candle updates to subscribed clients
 *
 * - Handles symbol subscriptions to start/stop data flow
 *
 * In short:
 * Acts as the central pipeline between data source, processing, and delivery.
 */

@injectable()
export class MarketDataService implements IMarketDataService {
    constructor(
        @inject(STOCK_TYPES.StockWebSocketClient) private readonly websocketClient: IStockWebsocketProvider,
        @inject(STOCK_TYPES.CandleEngineService) private readonly candleEngine: ICandleEngineService,
        @inject(STOCK_TYPES.TimeframeAggregatorService) private readonly timeframeAggregator: ITimeframeAggregatorService,
        @inject(STOCK_TYPES.PollingService) private readonly pollingService: IPollingService,
    ) { }

    private wsGateway!: IWsGateway;

    public setWsGateway(wsGateway: IWsGateway) {
        this.wsGateway = wsGateway;
    }

    public init() {
        this.websocketClient.connect();

        this.websocketClient.onTrade((trade: Trade) => {
            this.candleEngine.processTrade(trade);
        });


        this.candleEngine.onCandleUpdate((candle: ICandle) => {
            this.broadcastCandle(candle);
        });

        this.candleEngine.onCandleComplete((candle: ICandle) => {
            this.timeframeAggregator.process1mCandle(candle);
        });

        this.timeframeAggregator.onCandleUpdate((candle: ICandle) => {
            this.broadcastCandle(candle);
        });

        this.pollingService.start();
    }

    private broadcastCandle(candle: ICandle) {
        if (!this.wsGateway) return;

        const candleEntity = CandleMapper.toEntity(candle);

        this.wsGateway.broadcastToSubscribers(candleEntity);
        this.wsGateway.broadcastPriceUpdate(candle.symbol, candle.close);
    }

    public subscribeToSymbol(symbol: string) {
        console.log(`[MarketDataService] Subscribing to ${symbol}`);
        this.pollingService.addSymbol(symbol);
        this.websocketClient.connect();
        this.websocketClient.subscribe(symbol);
    }

    public unsubscribeFromSymbol(symbol: string) {
        console.log(`[MarketDataService] Unsubscribing from ${symbol}`);
        this.pollingService.removeSymbol(symbol);
        this.websocketClient.unsubscribe(symbol);
    }
}
