import { inject, injectable } from "inversify";
import { AdminDashboardDTO } from "@application/dto/admin/admin-dashboard.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IKycRepository } from "@application/interfaces/repositories/user/kyc-repository.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { IAdminDashboardUseCase } from "./admin-dashboard-usecase.interface";

@injectable()
export class AdminDashboardUseCase implements IAdminDashboardUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.KycRepository) private readonly _kycRepository: IKycRepository,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepository: ISubscriptionRepository,
    ) { }

    async execute(): Promise<AdminDashboardDTO> {

        const [
            pendingKycResult,
            totalUsersResult,
            premiumSubsResult,
            mfAumResult,
            stockAumResult,
            algoAumResult,
            totalMrrResult,
            activeSipsResult,
            userGrowthResult,
            cashFlowResult,
            recentTransactionsResult
        ] = await Promise.allSettled([
            this._kycRepository.getPendingKycCount(),
            this._userRepository.getTotalUsersCount(),
            this._userRepository.getPremiumUsersCount(),
            this._investmentRepository.calculateTotalAUM(),
            this._portfolioRepository.calculateTotalStockAUM(),
            this._tradeRepository.calculateTotalAlgoAUM(),
            this._subscriptionRepository.getTotalMRR(),
            this._sipRepository.getTotalActiveSipsCount(),
            this._userRepository.getUserRegistrationGrowthByMonth(6), // Last 6 months
            this._transactionRepository.getWeeklyCashFlow(),
            this._transactionRepository.getRecentTransactions(4) // Limit to 4 recent
        ]);

        const pendingKyc = pendingKycResult.status === 'fulfilled' ? pendingKycResult.value : 0;
        const totalUsers = totalUsersResult.status === 'fulfilled' ? totalUsersResult.value : 0;
        const premiumSubs = premiumSubsResult.status === 'fulfilled' ? premiumSubsResult.value : 0;
        const mfAum = mfAumResult.status === 'fulfilled' ? mfAumResult.value : 0;
        const stockAum = stockAumResult.status === 'fulfilled' ? stockAumResult.value : 0;
        const algoAum = algoAumResult.status === 'fulfilled' ? algoAumResult.value : 0;
        const totalMrr = totalMrrResult.status === 'fulfilled' ? totalMrrResult.value : 0;
        const activeSips = activeSipsResult.status === 'fulfilled' ? activeSipsResult.value : 0;

        const userGrowth = userGrowthResult.status === 'fulfilled' ? userGrowthResult.value : [];
        const cashFlow = cashFlowResult.status === 'fulfilled' ? cashFlowResult.value : [];
        const recentTransactionsData = recentTransactionsResult.status === 'fulfilled' ? recentTransactionsResult.value : [];

        const totalAum = mfAum + stockAum + algoAum;

        // Dynamic user names lookup for recent transactions
        const userIds = Array.from(new Set(recentTransactionsData.map(tx => tx.userId)));
        const users = await Promise.all(userIds.map(id => this._userRepository.findById(id)));
        const userMap = new Map<string, string>();
        for (const user of users) {
            if (user && user.id && user.fullName) {
                userMap.set(user.id, user.fullName);
            }
        }

        const recentTransactions = recentTransactionsData.map(tx => ({
            id: tx.transactionId,
            user: userMap.get(tx.userId) || "Unknown User",
            amount: tx.amount,
            type: tx.type,
            status: tx.status,
            time: tx.createdAt?.toISOString() || new Date().toISOString()
        }));

        return {
            stats: {
                pendingKyc,
                totalUsers,
                premiumSubs,
                totalAum,
                totalMrr,
                activeSips
            },
            charts: {
                userGrowth,
                cashFlow,
                investmentDistribution: {
                    mf: mfAum,
                    stocks: stockAum,
                    algo: algoAum
                }
            },
            recentTransactions
        };
    }
}
