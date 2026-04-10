
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

    PollingService: Symbol.for("PollingService"),

    CandleEngineService: Symbol.for("CandleEngineService"),
    TimeframeAggregatorService: Symbol.for("TimeframeAggregatorService"),

    //orders
    OrdersController: Symbol.for("OrdersController"),
    MarketBuyOrderUseCase: Symbol.for("MarketBuyOrderUseCase"),
    MarketSellOrderUseCase: Symbol.for("MarketSellOrderUseCase"),
    OrderRepository: Symbol.for("OrderRepository"),
    TradeRepository: Symbol.for("TradeRepository"),

    AlgoTradingController: Symbol.for("AlgoTradingController"),
    GetStrategiesUseCase: Symbol.for("GetStrategiesUseCase"),
    SaveAlgoStrategyUseCase: Symbol.for("SaveAlgoStrategyUseCase"),
    GetActiveStrategyUseCase: Symbol.for("GetActiveStrategyUseCase"),
    ToggleAlgoStrategyUseCase: Symbol.for("ToggleAlgoStrategyUseCase"),
    AlgoStrategyRepository: Symbol.for("AlgoStrategyRepository"),
    AlgoSignalRepository: Symbol.for("AlgoSignalRepository"),
    SignalService: Symbol.for("SignalService"),
    StrategyService: Symbol.for("StrategyService"),
    SignalManager: Symbol.for("SignalManager"),

    // EngineRunner:Symbol.for("EngineRunner")

}
