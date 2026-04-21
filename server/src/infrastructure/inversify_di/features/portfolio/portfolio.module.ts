import { ContainerModule } from "inversify";
import { PORTFOLIO_TYPES } from "./portfolio.types";
import { RadeemInvestmentUseCase } from "@application/use_cases/portfolio/radeem-investments-usecase";
import { ConfirmRedeemUseCase } from "@application/use_cases/portfolio/confirm-redeem-usecase";
import { PortfolioSummaryUseCase } from "@application/use_cases/portfolio/portfolio-summary.usecase";
import { IPortfolioSummaryUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-summary-usecase.interface";
import { PortFolioController } from "@presentation/http/controllers/portfolio/portfolio.controller";
import { IRadeemInvestmentUseCase } from "@application/use_cases/portfolio/interfaces/redeem-investments-usecase.interface";
import { IConfirmRedeemUseCase } from "@application/use_cases/portfolio/interfaces/confirm-redeem-usecase.interface";
import { IXirrCalculationUseCase } from "@application/use_cases/portfolio/interfaces/xirr-calculation-usecase.interface";
import { XirrCalculationUseCase } from "@application/use_cases/portfolio/xirr-calculation.usecase";
import { PortfolioProjectionUseCase } from "@application/use_cases/portfolio/portfolio-projection.usecase";
import { IPortfolioProjectionUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-projection-usecase.interface";
import { IFetchTradeHistoryUseCase } from "@application/use_cases/portfolio/interfaces/fetch-trade-history-usecase.interface";
import { FetchTradeHistoryUseCase } from "@application/use_cases/portfolio/fetch-trade-history.usecase";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { PortfolioRepository } from "@infrastructure/databases/repository/portfolio/portfolio.repository";
import { IFetchStockHoldingsUseCase } from "@application/use_cases/portfolio/interfaces/fetch-stock-holdings-usecase.interface";
import { FetchStockHoldingsUseCase } from "@application/use_cases/portfolio/fetch-stock-holdings.usecase";
import { IFetchMutualFundHoldingsUseCase } from "@application/use_cases/portfolio/interfaces/fetch-mf-holdings-usecase.interface";
import { FetchMutualFundHoldingsUseCase } from "@application/use_cases/portfolio/fetch-mf-holdings.usecase";

export const PortfolioModule = new ContainerModule(({ bind }) => {
    // Repositories
    bind<IPortfolioRepository>(PORTFOLIO_TYPES.PortfolioRepository).to(PortfolioRepository);

    // UseCases
    bind<IRadeemInvestmentUseCase>(PORTFOLIO_TYPES.RadeemInvestmentUseCase).to(RadeemInvestmentUseCase);
    bind<IConfirmRedeemUseCase>(PORTFOLIO_TYPES.ConfirmRedeemUseCase).to(ConfirmRedeemUseCase);
    bind<IPortfolioSummaryUseCase>(PORTFOLIO_TYPES.PortfolioSummaryUseCase).to(PortfolioSummaryUseCase);
    bind<IXirrCalculationUseCase>(PORTFOLIO_TYPES.XirrCalculationUseCase).to(XirrCalculationUseCase);
    bind<IPortfolioProjectionUseCase>(PORTFOLIO_TYPES.PortfolioProjectionUseCase).to(PortfolioProjectionUseCase)
    bind<IFetchTradeHistoryUseCase>(PORTFOLIO_TYPES.FetchTradeHistoryUseCase).to(FetchTradeHistoryUseCase);
    bind<IFetchStockHoldingsUseCase>(PORTFOLIO_TYPES.FetchStockHoldingsUseCase).to(FetchStockHoldingsUseCase);
    bind<IFetchMutualFundHoldingsUseCase>(PORTFOLIO_TYPES.FetchMutualFundHoldingsUseCase).to(FetchMutualFundHoldingsUseCase);

    // Controllers
    bind<PortFolioController>(PORTFOLIO_TYPES.PortFolioController).to(PortFolioController);
});
