export enum StockTradingRoutes {
    BASE_ROUTE = "/api/user/stocks",
    DEFAUTL = "/",
    GET_STOCKS = "/:symbol",
    GET_CANDLES = "/:symbol/candles",
    WATCHLIST = "/all/watchlist",
}