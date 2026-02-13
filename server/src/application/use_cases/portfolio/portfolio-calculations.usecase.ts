import { inject, injectable } from "inversify";
import { IPortfolioCalculationsUseCase } from "./interfaces/portfolio-calculations-usecase.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class PortfolioCalculationsUseCase implements IPortfolioCalculationsUseCase {

    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async execute(userId: string): Promise<{
        totalCount: number;
        totalInvestment: number;
        totalProfit: number;
        currentValue: number;
        profitPercentage: number;
    }> {

        const investments = await this.investmentRepository.getUserInvestmentsWithoutFilter(userId) ?? [];

        if (!investments.length) {
            return {
                totalCount: 0,
                totalInvestment: 0,
                totalProfit: 0,
                currentValue: 0,
                profitPercentage: 0,
            };
        }

        const totalCount = investments.length;

        let totalInvestment = 0;
        let currentValue = 0;

        const schemeCodes = [...new Set(investments.map(i => i.schemeCode))];

        const navMap = new Map<string, number>();

        await Promise.all(
            schemeCodes.map(async (schemeCode) => {
                const navHistory = await this.navUpdateProvider.fetchNavHistories(schemeCode);
                if (navHistory?.length) {
                    navMap.set(schemeCode, Number(navHistory[0].nav));
                }
            })
        );

        for (const inv of investments) {
            totalInvestment += Number(inv.amount);
            if (inv.status === InvestmentStatus.ALLOTTED && Number(inv.units) > 0) {
                const nav = navMap.get(inv.schemeCode);
                if (!nav) continue;
                currentValue += Number(inv.units) * nav;
            }
        }

        const totalProfit = currentValue - totalInvestment;
        const profitPercentage = (totalProfit / totalInvestment) * 100;

        return {
            totalCount,
            totalInvestment,
            totalProfit,
            currentValue,
            profitPercentage,
        };
    }
}
