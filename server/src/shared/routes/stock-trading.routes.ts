export enum StockTradingRoutes {
    BASE_ROUTE = "/api/user/stocks",
    DEFAUTL = "/",
    GET_STOCKS = "/:symbol",
    GET_CANDLES = "/:symbol/candles",
    WATCHLIST = "/all/watchlist",
    MOVERS = "/market/movers",
    ORDER_HISTORY = "/orders/history",
}

export enum OrderRoutes {
    PENDING = "/pending",
    BUY = "/:symbol/buy",
    SELL = "/:symbol/sell",
    LIMIT_BUY = "/:symbol/limit-buy",
    LIMIT_SELL = "/:symbol/limit-sell",
    CANCEL = "/:symbol/cancel/:orderId",
}