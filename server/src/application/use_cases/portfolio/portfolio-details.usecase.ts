import { inject, injectable } from "inversify";
import { IPortfolioDetailsUseCase } from "./interfaces/portfolio-details-usecase.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { toInvestmentResponse } from "@application/mappers/mutual-fund/investment.mapper";
import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { QueryOptions } from "mongoose";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class PortfolioDetailsUseCase implements IPortfolioDetailsUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async execute(userId: string, options: QueryOptions): Promise<{
        data: InvestmentResponseDTO[];
        page: number;
        limit: number;
        totalCount: number;
    }> {
        const { page = 1, limit = 10 } = options as any;
        const status = (options as any).status;

        const filter: any = {};
        if (status) {
            filter.status = status;
        }

        const investments = (await this._investmentRepository.getUserInvestments(userId, { ...options, filter })) ?? [];
        const totalCount = await this._investmentRepository.countInvestments(userId, filter, (options as any).search || "");

        const data: InvestmentResponseDTO[] = [];
        for (const inv of investments) {
            const latestNav = await this._navUpdateProvider.fetchNavHistories(inv.schemeCode);
            const fund = await this._mutualFundRepository.findBySchemeCode(inv.schemeCode);
            if (!fund) continue;
            let profit = 0;

            if (inv.status === InvestmentStatus.ALLOTTED && Number(inv.units) > 0) {
                profit =
                    Number(
                        ((Number(inv.units) * latestNav[0].nav)) - inv.amount
                    );
            }

            // Calculate Fund-level XIRR (user-specific cash flows for this scheme)
            const schemeInvestments = await this._investmentRepository.getTotalUnitsByUserAndScheme(userId, inv.schemeCode) ?? [];
            const fundXirr = this.calculateFundXirr(schemeInvestments, latestNav[0].nav);

            data.push(toInvestmentResponse(inv, fund, profit, fundXirr ?? undefined));
        }

        return {
            data,
            page: Number(page),
            limit: Number(limit),
            totalCount,
        };
    }

    private calculateFundXirr(investments: any[], currentNav: number): number | null {
        if (investments.length === 0) return null;

        const cashFlows: { date: Date; amount: number }[] = [];
        let totalRemainingUnits = 0;

        for (const inv of investments) {
            cashFlows.push({
                date: inv.createdAt,
                amount: -inv.amount,
            });

            if (inv.status === InvestmentStatus.REDEEMED) {
                cashFlows.push({
                    date: inv.redeemedAt ?? inv.updatedAt,
                    amount: inv.redeemedAmount,
                });
            } else {
                totalRemainingUnits += (inv.remainingUnits ?? 0);
            }
        }

        if (totalRemainingUnits > 0) {
            cashFlows.push({
                date: new Date(),
                amount: totalRemainingUnits * currentNav,
            });
        }

        if (cashFlows.length < 2) return null;

        const portfolioAgeDays = (Date.now() - new Date(cashFlows[0].date).getTime()) / (1000 * 60 * 60 * 24);
        if (portfolioAgeDays < 7) return null;

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
        const maxIterations = 1000;

        for (let i = 0; i < maxIterations; i++) {
            let npv = 0;
            let derivative = 0;

            for (const cf of cashFlows) {
                const years = (cf.date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
                const base = 1 + rate;
                if (base <= 0) return null;

                const discount = Math.pow(base, years);
                npv += cf.amount / discount;
                derivative -= (years * cf.amount) / (discount * base);
            }

            if (!isFinite(derivative) || derivative === 0) return null;
            const newRate = rate - npv / derivative;
            if (!isFinite(newRate)) return null;
            if (Math.abs(newRate - rate) < tolerance) return newRate;
            rate = newRate;
        }

        return null;
    }
}