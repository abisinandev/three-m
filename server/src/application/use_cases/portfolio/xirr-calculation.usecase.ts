import { inject, injectable } from "inversify";
import { IXirrCalculationUseCase } from "./interfaces/xirr-calculation-usecase.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { PortfolioXirrService } from "@domain/domain-services/portfolio/xirr-calculation.domain-service";
import { CashFlow } from "@domain/domain-services/portfolio/xirr-calculation.interface";

@injectable()
export class XirrCalculationUseCase implements IXirrCalculationUseCase {
    private xirrService = new PortfolioXirrService();

    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
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

            if (investment.status === InvestmentStatus.REDEEMED) {
                // Inflow (Redemption)
                cashFlows.push({
                    date: investment.redeemedAt as Date ?? investment.updatedAt,
                    amount: investment.redeemedAmount as number,
                });
            } else {
                totalCurrentValue += (investment.remainingUnits as number) * Number(investment.nav);
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