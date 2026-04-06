export const PORTFOLIO_TYPES = {
    // repositories
    PortfolioRepository: Symbol.for("PortfolioRepository"),

    // usecases
    PortfolioDetailsUseCase: Symbol.for("PortfolioDetailsUseCase"),
    RadeemInvestmentUseCase: Symbol.for("RadeemInvestmentUseCase"),
    ConfirmRedeemUseCase: Symbol.for("ConfirmRadeemUseCase"),
    PortfolioCalculationsUseCase: Symbol.for("PortfolioCalculationsUseCase"),
    XirrCalculationUseCase: Symbol.for("XirrCalculationUseCase"),
    PortfolioProjectionUseCase: Symbol.for("PortfolioProjectionUseCase"),
    FetchTradeHistoryUseCase: Symbol.for("FetchTradeHistoryUseCase"),
    FetchStockHoldingsUseCase: Symbol.for("FetchStockHoldingsUseCase"),
    FetchMutualFundHoldingsUseCase: Symbol.for("FetchMutualFundHoldingsUseCase"),

    // controllers
    PortFolioController: Symbol.for("PortFolioController"),
};
