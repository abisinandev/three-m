import { inject, injectable } from "inversify";
import { INavAllocateUseCase } from "../interfaces/features/mutual-funds/nav-allocate-usecase.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { getNavDate, isSameDate } from "@shared/utils/mutual-fund/nav-allocation-utils";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";

@injectable()
export class NavAllocateUseCase implements INavAllocateUseCase {

    constructor(
        @inject(FEATURE_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(FEATURE_TYPES.NavUpdateProvider) private readonly _navProvider: IMutualFundNavUpdateProvider,
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
                    console.log("No NAV found for date", navDate);
                    continue;
                }

                const updatedInvestment = InvestmentEntity.allotNav(
                    investment,
                    {
                        nav: Number(navForDate.nav),
                        navDate: new Date(navForDate.navDate),
                    }
                );

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