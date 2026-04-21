import { inject, injectable } from "inversify";
import { IFetchMutualFundHoldingsUseCase } from "./interfaces/fetch-mf-holdings-usecase.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { QueryOptions } from "mongoose";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { InvestmentFundDTO } from "@application/dto/portfolio/aggregated-asset.dto";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { PortfolioXirrService } from "@domain/domain-services/portfolio/xirr-calculation.domain-service";
import { CashFlow } from "@domain/domain-services/portfolio/xirr-calculation.interface";
import { toInvestmentResponse } from "@application/mappers/mutual-fund/investment.mapper";

@injectable()
export class FetchMutualFundHoldingsUseCase implements IFetchMutualFundHoldingsUseCase {
    private xirrService = new PortfolioXirrService();

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
            const currentNav = latestNav?.length ? latestNav[0].nav : 0;
            
            let profit = 0;
            if (inv.status === InvestmentStatus.ALLOTTED && Number(inv.units) > 0 && currentNav > 0) {
                profit = (Number(inv.units) * currentNav) - inv.amount;
            }

            const cashflows = this.buildCashFlows(schemeInvests, currentNav);
            const fundXirr = this.xirrService.calculate(cashflows);

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

    private buildCashFlows(investments: (InvestmentEntity | InvestmentFundDTO)[], currentNav: number): CashFlow[] {
        if (investments.length === 0) return [];

        const cashFlows: CashFlow[] = [];
        let totalRemainingUnits = 0;

        for (const inv of investments) {
            // Purchase/Buy cashflow (negative)
            cashFlows.push({
                date: new Date(inv.createdAt),
                amount: -(inv.amount || 0)
            });

            if (inv.status === InvestmentStatus.REDEEMED) {
                // Redemption cashflow (positive)
                cashFlows.push({
                    date: new Date(inv.redeemedAt || inv.updatedAt || inv.createdAt),
                    amount: inv.redeemedAmount || 0
                });
            } else {
                totalRemainingUnits += (inv.remainingUnits || 0);
            }
        }

        // Terminal cashflow (Current valuation - positive)
        if (totalRemainingUnits > 0 && currentNav > 0) {
            cashFlows.push({
                date: new Date(),
                amount: totalRemainingUnits * currentNav
            });
        }

        return cashFlows;
    }
}
