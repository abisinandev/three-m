import { inject, injectable } from "inversify";
import { INavAllocateUseCase } from "./interfaces/nav-allocate-usecase.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { getNavDate, isSameDate } from "@shared/utils/mutual-fund/nav-allocation-utils";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { InvestmentStatus, InvestmentType } from "@domain/enum/funds/investment.enums";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { IPortfolioService } from "@application/services/portfolio/interfaces/portfolio.service.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import mongoose from "mongoose";

@injectable()
export class NavAllocateUseCase implements INavAllocateUseCase {

    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navProvider: IMutualFundNavUpdateProvider,
        @inject(SIP_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository,
        @inject(PORTFOLIO_TYPES.PortfolioService) private readonly _portfolioService: IPortfolioService,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
    ) { }
    async execute(): Promise<void> {
        const investments = await this._investmentRepository.findInitiatedFunds();
        if (!investments || investments.length === 0) return;

        for (const investment of investments) {
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    const navDate = getNavDate(investment.createdAt);

                    const navHistories = await this._navProvider.fetchNavHistories(
                        investment.schemeCode
                    );

                    const navForDate = navHistories.find(nav =>
                        isSameDate(new Date(nav.navDate), navDate)//check today NAV value is available
                    );

                    if (!navForDate) {
                        logger.info(`No NAV found for date ${navDate}`);
                        return;
                    }

                    const updatedInvestment = InvestmentEntity.allotNav(
                        investment,
                        {
                            nav: Number(navForDate.nav),
                            navDate: new Date(navForDate.navDate),
                        }
                    );

                    const fund = await this._mutualFundRepository.findBySchemeCode(investment.schemeCode);
                    if (!fund) {
                        throw new Error(`Fund not found for scheme code: ${investment.schemeCode}`);
                    }

                    if (investment.investmentType === InvestmentType.SIP) {
                        await this._sipInstallmentRepository.update(
                            investment.sipInstallmentId as string,
                            {
                                units: updatedInvestment.units,
                                nav: updatedInvestment.nav,
                            },
                            session
                        );
                    }

                    await this._investmentRepository.update(
                        investment.id as string,
                        { ...updatedInvestment, status: InvestmentStatus.ALLOTTED },
                        session
                    );

                    await this._portfolioService.updateOrCreatePortfolio(
                        investment.userId,
                        fund.id as string,
                        AssetType.MUTUAL_FUND,
                        investment.amount,
                        updatedInvestment.nav as number,
                        session
                    );
                });

            } catch (error) {
                console.error(
                    `[NAV-ALLOCATION] Failed for investment ${investment.id}`,
                    error
                );
            } finally {
                await session.endSession();
            }
        }
    }
}
