export const PORTFOLIO_TYPES = {
    // repositories
    PortfolioRepository: Symbol.for("PortfolioRepository"),

    // usecases
    RadeemInvestmentUseCase: Symbol.for("RadeemInvestmentUseCase"),
    ConfirmRedeemUseCase: Symbol.for("ConfirmRadeemUseCase"),
    PortfolioSummaryUseCase: Symbol.for("PortfolioSummaryUseCase"),
    XirrCalculationUseCase: Symbol.for("XirrCalculationUseCase"),
    PortfolioProjectionUseCase: Symbol.for("PortfolioProjectionUseCase"),
    FetchTradeHistoryUseCase: Symbol.for("FetchTradeHistoryUseCase"),
    FetchStockHoldingsUseCase: Symbol.for("FetchStockHoldingsUseCase"),
    FetchMutualFundHoldingsUseCase: Symbol.for("FetchMutualFundHoldingsUseCase"),

    // controllers
    PortFolioController: Symbol.for("PortFolioController"),
};
