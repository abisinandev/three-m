import { inject, injectable } from "inversify";
import { IPortfolioDetailsUseCase } from "./interfaces/portfolio-details-usecase.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { toInvestmentResponse } from "@application/mappers/mutual-fund/investment.mapper";
import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { QueryOptions } from "mongoose";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { InvestmentStatus, InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";

interface PortfolioQueryOptions extends QueryOptions {
    status?: InvestmentStatus;
    search?: string;
}

interface InvestmentFilter {
    status?: InvestmentStatus;
}

interface InvestmentData {
    createdAt: Date;
    amount: number;
    status: InvestmentStatus;
    redeemedAt?: Date;
    updatedAt?: Date;
    redeemedAmount?: number;
    remainingUnits?: number;
}

@injectable()
export class PortfolioDetailsUseCase implements IPortfolioDetailsUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(userId: string, options: QueryOptions): Promise<{
        data: InvestmentResponseDTO[];
        page: number;
        limit: number;
        totalCount: number;
    }> {
        const { page = 1, limit = 10 } = options;
        const portfolioOptions = options as PortfolioQueryOptions;
        const status = portfolioOptions.status;

        const filter: InvestmentFilter = {};
        if (status) {
            filter.status = status;
        }

        const investments = (await this._investmentRepository.getUserInvestments(userId, { ...options, filter })) ?? [];
        const totalCount = await this._investmentRepository.countInvestments(userId, filter, portfolioOptions.search || "");

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

            const schemeInvestments = await this._investmentRepository.getTotalUnitsByUserAndScheme(userId, inv.schemeCode) ?? [];
            const fundXirr = this.calculateFundXirr(schemeInvestments, latestNav[0].nav);

            data.push(toInvestmentResponse(inv, fund, profit, fundXirr ?? undefined));
        }

        // --- ADD STOCK PORTFOLIOS ---
        // Exclude stocks if filtering specifically for Redeemed/Initiated/Failed that doesn't apply to stocks
        if (!status || status === InvestmentStatus.ALLOTTED) {
            const stockPortfolios = await this._portfolioRepository.findByUserId(userId);
            for (const stockPf of stockPortfolios) {
                // optional: search filtering on stocks
                if (portfolioOptions.search && !stockPf.symbol.toLowerCase().includes(portfolioOptions.search.toLowerCase())) {
                    continue;
                }

                const stockDetails = await this._stockRepository.findBySymbol(stockPf.symbol);
                
                data.push({
                    id: stockPf.id as string,
                    userId: stockPf.userId,
                    schemeCode: stockPf.symbol, // ticker
                    schemeName: stockDetails?.name || stockPf.symbol,
                    amount: stockPf.investedAmount,
                    units: stockPf.quantity,
                    nav: stockPf.avgPrice, // avg entry price
                    navDate: stockPf.updatedAt || stockPf.createdAt,
                    category: "Stock",
                    status: InvestmentStatus.ALLOTTED,
                    paymentMethod: PaymentMethod.WALLET, // assumed default
                    investmentType: InvestmentType.STOCK,
                    logo: stockDetails?.logo || "",
                    profit: 0, // In reality, we'd calculate this with live price. 
                    // Let's set it to 0 as live calculation might happen either in another service or frontend can calculate it based on live ltp update.
                    stopLoss: stockPf.stopLoss,
                    takeProfit: stockPf.takeProfit,
                    createdAt: stockPf.createdAt,
                    updatedAt: stockPf.updatedAt,
                }); 
            } 
        }

        return {
            data,
            page: Number(page),
            limit: Number(limit),
            totalCount: totalCount + (status && status !== InvestmentStatus.ALLOTTED ? 0 : (await this._portfolioRepository.findByUserId(userId)).length),
        };
    }

    private calculateFundXirr(investments: InvestmentData[], currentNav: number): number | null {
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
                    date: inv.redeemedAt as Date ?? inv.updatedAt,
                    amount: inv.redeemedAmount as number,
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