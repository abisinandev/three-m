import { ContainerModule } from "inversify";
import { PORTFOLIO_TYPES } from "./portfolio.types";

// UseCases
import { PortfolioDetailsUseCase } from "@application/use_cases/portfolio/portfolio-details.usecase";
import { RadeemInvestmentUseCase } from "@application/use_cases/portfolio/radeem-investments-usecase";
import { ConfirmRedeemUseCase } from "@application/use_cases/portfolio/confirm-redeem-usecase";
import { PortfolioCalculationsUseCase } from "@application/use_cases/portfolio/portfolio-calculations.usecase";

// Controllers
import { PortFolioController } from "@presentation/http/controllers/portfolio/portfolio.controller";

// Interfaces
import { IPortfolioDetailsUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-details-usecase.interface";
import { IRadeemInvestmentUseCase } from "@application/use_cases/portfolio/interfaces/redeem-investments-usecase.interface";
import { IConfirmRedeemUseCase } from "@application/use_cases/portfolio/interfaces/confirm-redeem-usecase.interface";


export const PortfolioModule = new ContainerModule(({ bind }) => {
    // UseCases
    bind<IPortfolioDetailsUseCase>(PORTFOLIO_TYPES.PortfolioDetailsUseCase).to(PortfolioDetailsUseCase);
    bind<IRadeemInvestmentUseCase>(PORTFOLIO_TYPES.RadeemInvestmentUseCase).to(RadeemInvestmentUseCase);
    bind<IConfirmRedeemUseCase>(PORTFOLIO_TYPES.ConfirmRedeemUseCase).to(ConfirmRedeemUseCase);
    bind<PortfolioCalculationsUseCase>(PORTFOLIO_TYPES.PortfolioCalculationsUseCase).to(PortfolioCalculationsUseCase);

    // Controllers
    bind<PortFolioController>(PORTFOLIO_TYPES.PortFolioController).to(PortFolioController);
});
