
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
    TurnOnAlgoTradingUseCase: Symbol.for("TurnOnAlgoTradingUseCase"),
    AlgoStrategyRepository: Symbol.for("AlgoStrategyRepository"),
    AlgoSignalRepository: Symbol.for("AlgoSignalRepository"),
    SignalService: Symbol.for("SignalService"),
    ConfirmBuySignalUseCase: Symbol.for("ConfirmBuySignalUseCase"),
    ConfirmSellSignalUseCase: Symbol.for("ConfirmSellSignalUseCase"),
    StrategyService: Symbol.for("StrategyService"),
    SignalManager: Symbol.for("SignalManager"),

    // Queue & BullMQ
    StrategyQueue: Symbol.for("StrategyQueue"),
    SignalQueue: Symbol.for("SignalQueue"),
    StrategyWorker: Symbol.for("StrategyWorker"),
    SignalWorker: Symbol.for("SignalWorker"),
    StrategyScheduler: Symbol.for("StrategyScheduler"),

    // EngineRunner:Symbol.for("EngineRunner")
    WatchlistRepository: Symbol.for("WatchlistRepository"),
    StockCandleRepository: Symbol.for("StockCandleRepository"),
    AddToWatchlistUseCase: Symbol.for("AddToWatchlistUseCase"),
    RemoveFromWatchlistUseCase: Symbol.for("RemoveFromWatchlistUseCase"),
    FetchWatchlistUseCase: Symbol.for("FetchWatchlistUseCase"),

}
