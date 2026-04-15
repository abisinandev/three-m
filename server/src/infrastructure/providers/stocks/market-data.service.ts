import { injectable, inject } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { Trade } from "@application/dto/stocks/stock.dto";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { WsGateway } from "@presentation/express/websocket/ws.gateway";
import { CandleMapper } from "@application/mappers/stock/candle.mapper";
import { ICandle } from "@infrastructure/databases/mongo_db/models/interfaces/stocks/stock-candle-schema.interface";
import { ICandleEngineService } from "@application/interfaces/services/stocks/candle-engine-service.interface";
import { ITimeframeAggregatorService } from "@application/interfaces/services/stocks/timeframe-aggragator.interface";
import { IPollingService } from "@application/interfaces/services/stocks/polling-service.interface";
import { IMarketDataService } from "@application/interfaces/services/stocks/market-data-service.usecase";

@injectable()
export class MarketDataService implements IMarketDataService {
    constructor(
        @inject(STOCK_TYPES.StockWebSocketClient) private readonly websocketClient: IStockWebsocketProvider,
        @inject(STOCK_TYPES.CandleEngineService) private readonly candleEngine: ICandleEngineService,
        @inject(STOCK_TYPES.TimeframeAggregatorService) private readonly timeframeAggregator: ITimeframeAggregatorService,
        @inject(STOCK_TYPES.PollingService) private readonly pollingService: IPollingService,
    ) { }

    private wsGateway!: WsGateway;

    public setWsGateway(wsGateway: WsGateway) {
        this.wsGateway = wsGateway;
    }

    public init() {

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
