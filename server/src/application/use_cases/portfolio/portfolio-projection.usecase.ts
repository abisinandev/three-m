import { inject, injectable } from "inversify"; import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IPortfolioProjectionUseCase } from "./interfaces/portfolio-projection-usecase.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { PortfolioProjectionDTO, PortfolioProjectionResponseDTO } from "@application/dto/portfolio/portfolio-projection.dto";
import { ValidationError } from "@presentation/express/utils/error-handling";

@injectable()
export class PortfolioProjectionUseCase implements IPortfolioProjectionUseCase {

    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async execute(data: PortfolioProjectionDTO, userId: string): Promise<PortfolioProjectionResponseDTO> {
        const { expectedReturnRate, years } = data;

        if (years < 1 || years > 30) {
            throw new ValidationError("Invalid projection period");
        }

        if (expectedReturnRate <= 0 || expectedReturnRate > 50) {
            throw new ValidationError("Invalid expected return rate");
        }

        const investments = await this._investmentRepository.getUserInvestementSummary(userId) ?? [];
        if (!investments.length) return {
            projectedValue: 0,
            projectedProfit: 0,
            futureTotalInvestment: 0,
            yearlyBreakdown: []
        };


        let totalInvestment = 0;
        let currentValue = 0;

        const schemeCodes = [...new Set(investments.map(i => i.schemeCode))];
        const navMap = new Map<string, number>();

        //setting latest nav
        await Promise.all(
            schemeCodes.map(async (schemeCode) => {
                const navHistory = await this._navUpdateProvider.fetchNavHistories(schemeCode);
                if (navHistory?.length) {
                    navMap.set(schemeCode, Number(navHistory[0].nav));
                }
            })
        );

        for (const inv of investments) {
            totalInvestment += inv.amount;
            if (inv.status === InvestmentStatus.ALLOTTED && Number(inv.units) > 0) {
                const nav = navMap.get(inv.schemeCode);
                if (!nav) continue;
                currentValue += Number(inv.units) * nav;
            }
        }

        const monthlyRate = data.expectedReturnRate / 100 / 12;
        const totalMonths = years * 12;

        let futureValue = currentValue;

        const yearlyBreakdown: { year: number; value: number }[] = [];

        for (let month = 1; month <= totalMonths; month++) {
            futureValue *= (1 + monthlyRate);
            if (month % 12 === 0) {
                yearlyBreakdown.push({
                    year: month / 12,
                    value: Number(futureValue.toFixed(2))
                });
            }
        }

        const futureTotalInvestment = totalInvestment;
        const projectedProfit = futureValue - futureTotalInvestment;

        return {
            projectedValue: Number(futureValue.toFixed(2)),
            projectedProfit: Number(projectedProfit.toFixed(2)),
            futureTotalInvestment,
            yearlyBreakdown
        };
    }
}