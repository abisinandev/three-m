import { inject, injectable } from "inversify";
import { IXirrCalculationUseCase } from "./interfaces/xirr-calculation-usecase.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { PortfolioXirrService } from "@domain/domain-services/portfolio/xirr-calculation.domain-service";
import { CashFlow } from "@domain/domain-services/portfolio/xirr-calculation.interface";
import { IMutualFundNavService } from "@application/services/mutual-fund/interfaces/mutual-fund-nav.service.interface";

@injectable()
export class XirrCalculationUseCase implements IXirrCalculationUseCase {
    private xirrService = new PortfolioXirrService();

    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundNavService) private readonly _navService: IMutualFundNavService,
    ) { }

    async execute(userId: string): Promise<number | null> {
        const investments = await this._investmentRepository.findUserInvestmentsForXirr(userId) ?? [];

        if (investments.length === 0) return null;

        const cashFlows: CashFlow[] = [];
        let totalCurrentValue = 0;

        for (const investment of investments) {
            // Outflow (Investment)
            cashFlows.push({
                date: investment.createdAt,
                amount: -investment.amount,
            });

            if (
                investment.status === InvestmentStatus.REDEEMED &&
                investment.redeemedAmount != null &&
                investment.redeemedAt != null
            ) {
                // Full redemption inflow
                cashFlows.push({
                    date: investment.redeemedAt,
                    amount: investment.redeemedAmount,
                });
            } else {
                const remainingUnits = investment.remainingUnits ?? 0;

                if (remainingUnits > 0) {
                    try {
                        const { nav: currentNav } = await this._navService.getLatestNav(investment.schemeCode);
                        totalCurrentValue += remainingUnits * currentNav;
                    } catch {
                        const purchaseNav = investment.nav ?? 0;
                        totalCurrentValue += remainingUnits * purchaseNav;
                    }
                }

                if (
                    investment.status === InvestmentStatus.PARTIALLY_REDEEMED &&
                    investment.redeemedAmount != null &&
                    investment.redeemedAt != null
                ) {
                    cashFlows.push({
                        date: investment.redeemedAt,
                        amount: investment.redeemedAmount,
                    });
                }
            }
        }

        if (totalCurrentValue > 0) {
            cashFlows.push({
                date: new Date(),
                amount: totalCurrentValue,
            });
        }

        return this.xirrService.calculate(cashFlows);
    }
}