import { inject, injectable } from "inversify";
import { IFetchMutualFundHoldingsUseCase } from "./interfaces/fetch-mf-holdings-usecase.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { toInvestmentResponse } from "@application/mappers/mutual-fund/investment.mapper";
import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { QueryOptions } from "mongoose";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";

@injectable()
export class FetchMutualFundHoldingsUseCase implements IFetchMutualFundHoldingsUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async execute(userId: string, options: QueryOptions): Promise<{
        data: InvestmentResponseDTO[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const { page = 1, limit = 10 } = options;

        const [investments, total] = await Promise.all([
            this._investmentRepository.getUserInvestments(userId, options),
            this._investmentRepository.countInvestments(userId, options),
        ]);

        const data: InvestmentResponseDTO[] = [];
        for (const inv of investments) {
            const [latestNav, fund, schemeInvestments] = await Promise.all([
                this._navUpdateProvider.fetchNavHistories(inv.schemeCode),
                this._mutualFundRepository.findBySchemeCode(inv.schemeCode),
                this._investmentRepository.getTotalUnitsByUserAndScheme(userId, inv.schemeCode)
            ]);

            if (!fund) continue;

            const schemeInvests = schemeInvestments ?? [];
            let profit = 0;
            if (inv.status === InvestmentStatus.ALLOTTED && Number(inv.units) > 0 && latestNav?.length) {
                profit = (Number(inv.units) * latestNav[0].nav) - inv.amount;
            }

            const fundXirr = this.calculateFundXirr(schemeInvests, latestNav?.length ? latestNav[0].nav : 0);
            data.push(toInvestmentResponse(inv, fund, profit, fundXirr ?? undefined));
        }

        return {
            data,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / (Number(limit) || 10)),
        };
    }

    private calculateFundXirr(investments: InvestmentEntity[], currentNav: number): number | null {
        if (investments.length === 0) return null;
        const cashFlows: { date: Date; amount: number }[] = [];
        let totalRemainingUnits = 0;

        for (const inv of investments) {
            cashFlows.push({ date: new Date(inv.createdAt), amount: -inv.amount });
            if (inv.status === InvestmentStatus.REDEEMED) {
                cashFlows.push({
                    date: new Date(inv.redeemedAt || inv.updatedAt || new Date()),
                    amount: inv.redeemedAmount as number,
                });
            } else {
                totalRemainingUnits += (inv.remainingUnits ?? 0);
            }
        }

        if (totalRemainingUnits > 0) {
            cashFlows.push({ date: new Date(), amount: totalRemainingUnits * currentNav });
        }

        if (cashFlows.length < 2) return null;
        return this.solveXirr(cashFlows);
    }

    private solveXirr(cashFlows: { date: Date; amount: number }[]): number | null {
        const hasPositive = cashFlows.some(c => c.amount > 0);
        const hasNegative = cashFlows.some(c => c.amount < 0);
        if (!hasPositive || !hasNegative) return null;

        cashFlows.sort((a, b) => a.date.getTime() - b.date.getTime());
        const firstDate = cashFlows[0].date;

        let rate = 0.1;
        const tolerance = 1e-7;
        for (let i = 0; i < 1000; i++) {
            let npv = 0;
            let derivative = 0;
            for (const cf of cashFlows) {
                const years = (cf.date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
                const discount = Math.pow(1 + rate, years);
                npv += cf.amount / discount;
                derivative -= (years * cf.amount) / (discount * (1 + rate));
            }
            if (derivative === 0) return null;
            const newRate = rate - npv / derivative;
            if (Math.abs(newRate - rate) < tolerance) return newRate;
            rate = newRate;
        }
        return null;
    }
}
