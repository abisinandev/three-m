import { inject, injectable } from "inversify";
import { IAdminDashboardUseCase } from "./interface/admin-dashboard-usecase.interface";
import { AdminDashboardDTO } from "@application/dto/admin/admin-dashboard.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IKycRepository } from "@application/interfaces/repositories/user/kyc-repository.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";

@injectable()
export class AdminDashboardUseCase implements IAdminDashboardUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.KycRepository) private readonly _kycRepository: IKycRepository,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
    ) { }

    async execute(): Promise<AdminDashboardDTO> {

        const [
            pendingKycResult,
            totalUsersResult,
            premiumSubsResult,
            totalAumResult,
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
            this._transactionRepository.getTotalMRR(),
            this._sipRepository.getTotalActiveSipsCount(),
            this._userRepository.getUserRegistrationGrowthByMonth(6), // Last 6 months
            this._transactionRepository.getWeeklyCashFlow(),
            this._transactionRepository.getRecentTransactions(4) // Limit to 4 recent
        ]);

        const pendingKyc = pendingKycResult.status === 'fulfilled' ? pendingKycResult.value : 0;
        const totalUsers = totalUsersResult.status === 'fulfilled' ? totalUsersResult.value : 0;
        const premiumSubs = premiumSubsResult.status === 'fulfilled' ? premiumSubsResult.value : 0;
        const totalAumData = totalAumResult.status === 'fulfilled' ? totalAumResult.value : { mf: 0, stocks: 0, algo: 0 };
        const totalMrr = totalMrrResult.status === 'fulfilled' ? totalMrrResult.value : 0;
        const activeSips = activeSipsResult.status === 'fulfilled' ? activeSipsResult.value : 0;

        const userGrowth = userGrowthResult.status === 'fulfilled' ? userGrowthResult.value : [];
        const cashFlow = cashFlowResult.status === 'fulfilled' ? cashFlowResult.value : [];
        const recentTransactionsData = recentTransactionsResult.status === 'fulfilled' ? recentTransactionsResult.value : [];

        const totalAum = totalAumData.mf + totalAumData.stocks + totalAumData.algo;

        const recentTransactions = recentTransactionsData.map(tx => ({
            id: tx.transactionId,
            user: "User", // Ideally populate user details or map from tx
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
                investmentDistribution: totalAumData
            },
            recentTransactions
        };
    }
}
