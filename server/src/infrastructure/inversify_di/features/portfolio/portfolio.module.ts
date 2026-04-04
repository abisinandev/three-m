import { ContainerModule } from "inversify";
import { PORTFOLIO_TYPES } from "./portfolio.types";
import { PortfolioDetailsUseCase } from "@application/use_cases/portfolio/portfolio-details.usecase";
import { RadeemInvestmentUseCase } from "@application/use_cases/portfolio/radeem-investments-usecase";
import { ConfirmRedeemUseCase } from "@application/use_cases/portfolio/confirm-redeem-usecase";
import { PortfolioCalculationsUseCase } from "@application/use_cases/portfolio/portfolio-calculations.usecase";
import { PortFolioController } from "@presentation/http/controllers/portfolio/portfolio.controller";
import { IPortfolioDetailsUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-details-usecase.interface";
import { IRadeemInvestmentUseCase } from "@application/use_cases/portfolio/interfaces/redeem-investments-usecase.interface";
import { IConfirmRedeemUseCase } from "@application/use_cases/portfolio/interfaces/confirm-redeem-usecase.interface";
import { IXirrCalculationUseCase } from "@application/use_cases/portfolio/interfaces/xirr-calculation-usecase.interface";
import { XirrCalculationUseCase } from "@application/use_cases/portfolio/xirr-calculation.usecase";
import { PortfolioProjectionUseCase } from "@application/use_cases/portfolio/portfolio-projection.usecase";
import { IPortfolioProjectionUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-projection-usecase.interface";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { PortfolioRepository } from "@infrastructure/databases/repository/portfolio/portfolio.repository";

export const PortfolioModule = new ContainerModule(({ bind }) => {
    // Repositories
    bind<IPortfolioRepository>(PORTFOLIO_TYPES.PortfolioRepository).to(PortfolioRepository);

    // UseCases
    bind<IPortfolioDetailsUseCase>(PORTFOLIO_TYPES.PortfolioDetailsUseCase).to(PortfolioDetailsUseCase);
    bind<IRadeemInvestmentUseCase>(PORTFOLIO_TYPES.RadeemInvestmentUseCase).to(RadeemInvestmentUseCase);
    bind<IConfirmRedeemUseCase>(PORTFOLIO_TYPES.ConfirmRedeemUseCase).to(ConfirmRedeemUseCase);
    bind<PortfolioCalculationsUseCase>(PORTFOLIO_TYPES.PortfolioCalculationsUseCase).to(PortfolioCalculationsUseCase);
    bind<IXirrCalculationUseCase>(PORTFOLIO_TYPES.XirrCalculationUseCase).to(XirrCalculationUseCase);
    bind<IPortfolioProjectionUseCase>(PORTFOLIO_TYPES.PortfolioProjectionUseCase).to(PortfolioProjectionUseCase)

    // Controllers
    bind<PortFolioController>(PORTFOLIO_TYPES.PortFolioController).to(PortFolioController);
});
