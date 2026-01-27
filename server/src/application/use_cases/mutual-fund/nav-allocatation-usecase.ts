import { inject, injectable } from "inversify";
import { INavAllocateUseCase } from "./interfaces/nav-allocate-usecase.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { getNavDate, isSameDate } from "@shared/utils/mutual-fund/nav-allocation-utils";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { InvestmentType } from "@domain/enum/funds/investment.enums";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";

@injectable()
export class NavAllocateUseCase implements INavAllocateUseCase {

    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navProvider: IMutualFundNavUpdateProvider,
        @inject(SIP_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository,
    ) { }
    async execute(): Promise<void> {
        const investments = await this._investmentRepository.findInitiatedFunds();
        if (!investments || investments.length === 0) return;

        for (const investment of investments) {
            try {
                const navDate = getNavDate(investment.createdAt);

                const navHistories = await this._navProvider.fetchNavHistories(
                    investment.schemeCode
                );

                const navForDate = navHistories.find(nav =>
                    isSameDate(new Date(nav.navDate), navDate)
                );

                if (!navForDate) {
                    logger.info(`No NAV found for date ${navDate}`);
                    continue;
                }

                const updatedInvestment = InvestmentEntity.allotNav(
                    investment,
                    {
                        nav: Number(navForDate.nav),
                        navDate: new Date(navForDate.navDate),
                    }
                );

                if (investment.investmentType === InvestmentType.SIP) {
                    await this._sipInstallmentRepository.update(
                        investment.sipInstallmentId as string,
                        {
                            units: updatedInvestment.units,
                            nav: updatedInvestment.nav,
                        }
                    );
                }
                
                await this._investmentRepository.update(
                    investment.id as string,
                    updatedInvestment,
                );

            } catch (error) {
                console.error(
                    `[NAV-ALLOCATION] Failed for investment ${investment.id}`,
                    error
                );
            }
        }
    }

}