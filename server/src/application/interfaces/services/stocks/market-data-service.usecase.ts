import { WsGateway } from "@presentation/express/websocket/ws.gateway";

export interface IMarketDataService {
    /**
     * Inject WebSocket gateway after instantiation
     */
    setWsGateway(wsGateway: WsGateway): void;

    /**
     * Initialize subscriptions and data flow pipelines
     */
    init(): void;

    /**
     * Subscribe to a symbol's market data
     */
    subscribeToSymbol(symbol: string): void;

    /**
     * Unsubscribe from a symbol's market data
     */
    unsubscribeFromSymbol(symbol: string): void;
}