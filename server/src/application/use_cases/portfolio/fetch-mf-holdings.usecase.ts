import { inject, injectable } from "inversify";
import { IFetchMutualFundHoldingsUseCase } from "./interfaces/fetch-mf-holdings-usecase.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IMutualFundNavService } from "@application/services/mutual-fund/interfaces/mutual-fund-nav.service.interface";
import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { QueryOptions } from "mongoose";
import { InvestmentStatus, InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";
import { PortfolioXirrService } from "@domain/domain-services/portfolio/xirr-calculation.domain-service";
import { CashFlow } from "@domain/domain-services/portfolio/xirr-calculation.interface";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";

@injectable()
export class FetchMutualFundHoldingsUseCase implements IFetchMutualFundHoldingsUseCase {
    private xirrService = new PortfolioXirrService();

    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundNavService) private readonly _navService: IMutualFundNavService,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
    ) { }

    async execute(userId: string, options: QueryOptions): Promise<{
        data: InvestmentResponseDTO[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const { page = 1, limit = 10, search = "" } = options;

        const filter = { assetType: AssetType.MUTUAL_FUND };

        const [mfPortfolios, total] = await Promise.all([
            this._portfolioRepository.findWithFilters(userId, { ...options, filter }),
            this._portfolioRepository.countWithFilters(userId, filter, search as string)
        ]);

        const data: InvestmentResponseDTO[] = [];

        for (const pf of mfPortfolios) {
            const fund = await this._mutualFundRepository.findById(pf.assetId);
            if (!fund) continue;

            const { nav: currentNav, navDate: currentNavDate } = await this._navService.getLatestNav(fund.schemeCode);

            const investments = await this._investmentRepository.getTotalUnitsByUserAndScheme(userId, fund.schemeCode);

            const currentValue = (pf.units ?? 0) * currentNav;
            const profit = currentValue - pf.investedAmount;

            const cashflows = this.buildCashFlows(investments, currentNav);
            const fundXirr = this.xirrService.calculate(cashflows);

            data.push({
                schemeCode: fund.schemeCode,
                schemeName: fund.schemeName,
                amount: pf.investedAmount,
                units: pf.units || 0,
                quantity: pf.units || 0,
                nav: pf.avgPrice,
                avgPrice: pf.avgPrice,
                currentPrice: currentNav,
                currentValue: currentValue,
                profitPercentage: pf.investedAmount > 0 ? (profit / pf.investedAmount) * 100 : 0,
                navDate: currentNavDate,
                category: fund.category,
                status: InvestmentStatus.HOLDING,
                paymentMethod: PaymentMethod.WALLET,
                investmentType: InvestmentType.ONETIME,
                logo: fund.logo || "",
                profit: profit,
                xirr: fundXirr ?? 0,
                createdAt: pf.createdAt,
                updatedAt: pf.updatedAt,
            });
        }

        return {
            data,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / (Number(limit) || 10)),
        };
    }

    private buildCashFlows(investments: InvestmentEntity[], currentNav: number): CashFlow[] {
        if (investments.length === 0) return [];

        const cashFlows: CashFlow[] = [];
        let totalRemainingUnits = 0;

        for (const inv of investments) {
            cashFlows.push({
                date: new Date(inv.createdAt),
                amount: -(inv.amount || 0)
            });

            if (inv.status === InvestmentStatus.REDEEMED) {
                cashFlows.push({
                    date: new Date(inv.redeemedAt || inv.updatedAt || inv.createdAt),
                    amount: inv.redeemedAmount || 0
                });
            } else {
                totalRemainingUnits += (inv.remainingUnits || 0);
            }
        }

        if (totalRemainingUnits > 0 && currentNav > 0) {
            cashFlows.push({
                date: new Date(),
                amount: totalRemainingUnits * currentNav
            });
        }

        return cashFlows;
    }
}

