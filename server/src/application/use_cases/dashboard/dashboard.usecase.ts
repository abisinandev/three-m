import { inject, injectable } from "inversify";
import { IDashboardUseCase } from "./interface/dashboard-usecase.interface";
import { DashboardDTO, DashboardExpenseDTO, DashboardInvestmentDTO, DashboardPortfolioDTO, DashboardSipDTO, DashboardWalletDTO } from "@application/dto/user/dashboard.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";

@injectable()
export class DashboardUseCase implements IDashboardUseCase {

    constructor(
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository) private readonly _expenseTrackerRepository: IExpenseTrackerRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
    ) { }

    async execute(userId: string): Promise<DashboardDTO> {

        const [
            walletResult,
            portfolioResult,
            totalInvestmentResult,
            totalIncomeResult,
            totalExpensesResult,
            categoryBreakdownResult,
            portfolioGrowthResult,
            recentSipsResult,
            recentInvestmentsResult,
        ] = await Promise.allSettled([
            this._walletRepository.findByUserId(userId),
            this._portfolioRepository.findByUserId(userId),
            this._investmentRepository.findByUsertotalInvestments(userId),
            this._expenseTrackerRepository.totalIncome(userId),
            this._expenseTrackerRepository.totalExpenses(userId),
            this._expenseTrackerRepository.categoryBreakdown(userId),
            this._investmentRepository.portfolioGrowthByMonth(userId),
            this._sipRepository.findUserActiveSips(userId, 3),
            this._investmentRepository.getUserInvestementSummary(userId),
        ]);

        const wallet = walletResult.status === "fulfilled" && walletResult.value
            ? <DashboardWalletDTO>{
                balance: walletResult.value.balance,
                currency: walletResult.value.currency,
            }
            : null;

        const portfolioHoldings = portfolioResult.status === "fulfilled" && portfolioResult.value
            ? portfolioResult.value
            : [];

        const totalInvestedAmount = portfolioHoldings.reduce(
            (sum, h) => sum + (h.investedAmount ?? 0), 0
        );

        const portfolio: DashboardPortfolioDTO = {
            totalHoldings: portfolioHoldings.length,
            stockHoldingsCount: portfolioHoldings.length,
            totalInvestedAmount,
        };

        const totalIncome = totalIncomeResult.status === "fulfilled" ? totalIncomeResult.value : 0;
        const totalExpenses = totalExpensesResult.status === "fulfilled" ? totalExpensesResult.value : 0;
        const breakdown = categoryBreakdownResult.status === "fulfilled"
            ? categoryBreakdownResult.value
            : { needsSpent: 0, wantsSpent: 0, savingsSpent: 0 };

        const expense: DashboardExpenseDTO = {
            totalIncome,
            totalExpenses,
            netSavings: totalIncome - totalExpenses,
            needsSpent: breakdown.needsSpent,
            wantsSpent: breakdown.wantsSpent,
            savingsSpent: breakdown.savingsSpent,
        };

        const totalMutualFundInvestment =
            totalInvestmentResult.status === "fulfilled" ? totalInvestmentResult.value : 0;

        const portfolioGrowth = portfolioGrowthResult.status === "fulfilled"
            ? portfolioGrowthResult.value
            : [];

        const rawSips = recentSipsResult.status === "fulfilled" ? recentSipsResult.value : [];
        const recentSips: DashboardSipDTO[] = await Promise.all(rawSips.map(async s => {
            const fund = await this._mutualFundRepository.findBySchemeCode(s.schemeCode);
            return {
                id: s.id ?? "",
                schemeCode: s.schemeCode,
                schemeName: fund?.schemeName,
                logo: fund?.logo,
                amount: s.amount,
                frequency: s.frequency,
                status: s.status,
                executedInstallments: s.executedInstallments,
                totalInstallments: s.totalInstallments,
                nextExecutionDate: s.nextExecutionDate,
            };
        }));

        const rawInvestments = recentInvestmentsResult.status === "fulfilled"
            ? recentInvestmentsResult.value.slice(0, 4)
            : [];
        const recentInvestments: DashboardInvestmentDTO[] = await Promise.all(rawInvestments.map(async inv => {
            const fund = await this._mutualFundRepository.findBySchemeCode(inv.schemeCode);
            return {
                id: inv.id || "",
                schemeCode: inv.schemeCode,
                schemeName: fund?.schemeName,
                logo: fund?.logo,
                amount: inv.amount,
                units: inv.units ?? 0,
                nav: inv.nav ?? 0,
                status: inv.status,
                investmentType: inv.investmentType,
                createdAt: inv.createdAt,
            };
        }));

        return {
            wallet,
            expense,
            portfolio,
            totalMutualFundInvestment,
            portfolioGrowth,
            recentSips,
            recentInvestments,
        };
    }
}