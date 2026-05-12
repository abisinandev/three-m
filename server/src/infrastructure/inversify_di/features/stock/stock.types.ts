
export const STOCK_TYPES = {
    StockRepository: Symbol.for("StockRepository"),

    StockWebSocketClient: Symbol.for("StockWebSocketClient"),
    MarketDataProvider: Symbol.for("MarketDataProvider"),
    StockSearchProvider: Symbol.for("StockSearchProvider"),
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
    ExecuteMarketBuyOrderUseCase: Symbol.for("ExecuteMarketBuyOrderUseCase"),
    MarketSellOrderUseCase: Symbol.for("MarketSellOrderUseCase"),
    ExecuteMarketSellOrderUseCase: Symbol.for("ExecuteMarketSellOrderUseCase"),
    LimitBuyOrderUseCase: Symbol.for("LimitBuyOrderUseCase"),
    ExecuteLimitBuyOrderUseCase: Symbol.for("ExecuteLimitBuyOrderUseCase"),
    LimitSellOrderUseCase: Symbol.for("LimitSellOrderUseCase"),
    ExecuteLimitSellOrderUseCase: Symbol.for("ExecuteLimitSellOrderUseCase"),
    CancelLimitOrderUseCase: Symbol.for("CancelLimitOrderUseCase"),
    FetchPendingOrdersUseCase: Symbol.for("FetchPendingOrdersUseCase"),
    OrderRepository: Symbol.for("OrderRepository"),
    TradeRepository: Symbol.for("TradeRepository"),

    AlgoTradingController: Symbol.for("AlgoTradingController"),
    GetStrategiesUseCase: Symbol.for("GetStrategiesUseCase"),
    SaveAlgoStrategyUseCase: Symbol.for("SaveAlgoStrategyUseCase"),
    GetActiveStrategyUseCase: Symbol.for("GetActiveStrategyUseCase"),
    TurnOnAlgoTradingUseCase: Symbol.for("TurnOnAlgoTradingUseCase"),
    AlgoStrategyRepository: Symbol.for("AlgoStrategyRepository"),
    AlgoSignalRepository: Symbol.for("AlgoSignalRepository"),
    ProcessSignalUseCase: Symbol.for("ProcessSignalUseCase"),
    ConfirmBuySignalUseCase: Symbol.for("ConfirmBuySignalUseCase"),
    ConfirmSellSignalUseCase: Symbol.for("ConfirmSellSignalUseCase"),
    SignalManager: Symbol.for("SignalManager"),
    StrategiesUseCase: Symbol.for("StrategiesUseCase"),
    AlgoStrategyConfigRepository: Symbol.for("AlgoStrategyConfigRepository"),
    AdminGetBaseStrategiesUseCase: Symbol.for("AdminGetBaseStrategiesUseCase"),
    AdminUpdateStrategyRiskConfigUseCase: Symbol.for("AdminUpdateStrategyRiskConfigUseCase"),
    EvaluateStrategyUseCase: Symbol.for("EvaluateStrategyUseCase"),

    // Queue & BullMQ
    StrategyQueue: Symbol.for("StrategyQueue"),
    SignalQueue: Symbol.for("SignalQueue"),
    StrategyWorker: Symbol.for("StrategyWorker"),
    SignalWorker: Symbol.for("SignalWorker"),
    OrderWorker: Symbol.for("OrderWorker"),
    StrategyScheduler: Symbol.for("StrategyScheduler"),
    LimitOrderScheduler: Symbol.for("LimitOrderScheduler"),

    OrderQueue: Symbol.for("OrderQueue"),
    SlTpOrderQueue: Symbol.for("SlTpOrderQueue"),
    SlTpOrderWorker: Symbol.for("SlTpOrderWorker"),
    SlTpOrderScheduler: Symbol.for("SlTpOrderScheduler"),
    ExecuteSlTpUseCase: Symbol.for("ExecuteSlTpUseCase"),
    DispatchLimitOrdersUseCase: Symbol.for("DispatchLimitOrdersUseCase"),
    DispatchSlTpOrdersUseCase: Symbol.for("DispatchSlTpOrdersUseCase"),


    WatchlistRepository: Symbol.for("WatchlistRepository"),
    StockCandleRepository: Symbol.for("StockCandleRepository"),
    AddToWatchlistUseCase: Symbol.for("AddToWatchlistUseCase"),
    RemoveFromWatchlistUseCase: Symbol.for("RemoveFromWatchlistUseCase"),
    FetchWatchlistUseCase: Symbol.for("FetchWatchlistUseCase"),
    GetMarketMoversUseCase: Symbol.for("GetMarketMoversUseCase"),
    StockValidationService: Symbol.for("StockValidationService"),
}

