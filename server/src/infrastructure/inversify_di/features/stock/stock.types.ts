
export const STOCK_TYPES = {
    StockRepository: Symbol.for("StockRepository"),
    StockApiClient: Symbol.for("StockApiClient"),

    StockWebSocketClient: Symbol.for("StockWebSocketClient"),
    MarketDataProvider: Symbol.for("MarketDataProvider"),
    FetchStocksUseCase: Symbol.for("FetchStocksUseCase"),
    UserStocksController: Symbol.for("UserStocksController"),
}