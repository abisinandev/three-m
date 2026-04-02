export const STOCK_TYPES = {
    StockRepository: Symbol.for("StockRepository"),

    StockWebSocketClient: Symbol.for("StockWebSocketClient"),
    MarketDataProvider: Symbol.for("MarketDataProvider"),
    FetchStocksUseCase: Symbol.for("FetchStocksUseCase"),
    UserStocksController: Symbol.for("UserStocksController"),

    StockDetailsUseCase: Symbol.for("StockDetailsUseCase"),
    FetchStockCandlesUseCase: Symbol.for("FetchStockCandlesUseCase"),

    FinnhubService: Symbol.for("FinnhubService"),
    AlpacaProvider: Symbol.for("AlpacaProvider"),

    MarketDataService: Symbol.for("MarketDataService"),
    WsGateway: Symbol.for("WsGateway"),

    YahooProvider: Symbol.for("YahooProvider"),
    PollingService: Symbol.for("PollingService"),

    CandleEngineService: Symbol.for("CandleEngineService"),
    TimeframeAggregatorService: Symbol.for("TimeframeAggregatorService"),
}
