import { inject, injectable } from "inversify";
import { IXirrCalculationUseCase } from "./interfaces/xirr-calculation-usecase.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";

interface CashFlow {
    amount: number;
    date: Date;
}

@injectable()
export class XirrCalculationUseCase implements IXirrCalculationUseCase {

    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
    ) { }

    async execute(userId: string): Promise<number | null> {

        const investments = await this._investmentRepository.findUserInvestmentsForXirr(userId) ?? [];
        console.log("investments xirr: ", investments);

        if (investments.length === 0) return null;
        const cashFlows: { date: Date; amount: number }[] = [];
        let totalCurrentValue = 0;
        for (const investment of investments) {
            cashFlows.push({ 
                date: investment.createdAt,
                amount: -investment.amount,
            });

            if (investment.status === InvestmentStatus.REDEEMED) {
                cashFlows.push({
                    date: investment.redeemedAt as Date ?? investment.updatedAt,
                    amount: investment.redeemedAmount as number,
                });
            } else {
                totalCurrentValue += investment.remainingUnits as number * Number(investment.nav);
            }
        }

        if (totalCurrentValue > 0) {
            cashFlows.push({
                date: new Date(),
                amount: totalCurrentValue,
            });
        }

        cashFlows.sort((a, b) => a.date.getTime() - b.date.getTime());
        const portfolioAgeDays =
            (Date.now() - cashFlows[0].date.getTime()) / (1000 * 60 * 60 * 24);
        
        if (portfolioAgeDays < 7) {
            return null;
        }
        console.log("cashFlows: ", cashFlows);
        
        const xirrr = this.calculateXirr(cashFlows);
        console.log("XiRR,", xirrr);
        return xirrr
    }

    private daysBetween(d1: Date, d2: Date): number {
        const msPerDay = 1000 * 60 * 60 * 24;
        return (d2.getTime() - d1.getTime()) / msPerDay;
    }

    private calculateXirr(cashFlows: CashFlow[]): number | null {
        if (cashFlows.length < 2) return null;
 
        const hasPositive = cashFlows.some(c => c.amount > 0);
        const hasNegative = cashFlows.some(c => c.amount < 0);
        if (!hasPositive || !hasNegative) return null;

        cashFlows.sort((a, b) => a.date.getTime() - b.date.getTime());
        const firstDate = cashFlows[0].date;

        let rate = 0.1;
        const tolerance = 1e-7;
        const maxIterations = 1000;

        for (let i = 0; i < maxIterations; i++) {
            let npv = 0;
            let derivative = 0;

            for (const cf of cashFlows) {
                const years = this.daysBetween(firstDate, cf.date) / 365;
                const base = 1 + rate;

                if (base <= 0) return null;

                const discount = Math.pow(base, years);
                npv += cf.amount / discount;
                derivative -= (years * cf.amount) / (discount * base);
            }

            if (!isFinite(derivative) || derivative === 0) return null;

            const newRate = rate - npv / derivative;

            if (!isFinite(newRate)) return null;

            if (Math.abs(newRate - rate) < tolerance) {
                return newRate;
            }

            rate = newRate;
        }

        return null;
    }

}   