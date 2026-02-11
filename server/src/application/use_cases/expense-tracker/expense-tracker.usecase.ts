import { IExpenseTrackerUseCase } from "./interfaces/expense-tracker-usecase.interface";
import { inject, injectable } from "inversify";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { ExpenseTrackerDTO, InvestmentDTO } from "@application/dto/expense-tracker/expense-tracker-response.dto";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";

@injectable()
export class ExpenseTrackerUseCase implements IExpenseTrackerUseCase {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository) private readonly _expenseTrackerRepository: IExpenseTrackerRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
    ) { }

    async execute(userId: string): Promise<ExpenseTrackerDTO> {
        const currentMonth = new Date().toISOString().slice(0, 7);

        const tracker = await this._expenseTrackerRepository.findOne({ userId, month: currentMonth });
        const wallet = await this._walletRepository.findByUserId(userId);
        if (wallet?.status === WalletStatus.PENDING) {
            throw new ValidationError(ErrorMessage.COMPLETE_KYC_VERIFICATION);
        }

        const expenses = tracker ? tracker.expenses.map(exp => ({
            amount: exp.amount,
            category: exp.category,
            type: exp.type,
            description: exp.description,
            date: exp.date,
            paymentMode: exp.paymentMode
        })) : [];

        const incomeSources = tracker ? tracker.incomes.map(inc => ({
            source: inc.source,
            amount: inc.amount,
        })) : [];

        const userInvestments = await this._investmentRepository.findInvestmentsByUser(userId);
        const totalInvestment = (userInvestments ?? []).reduce(
            (acc, curr) => acc + (Number(curr.amount) || 0),
            0
        );

        const investments: InvestmentDTO[] = userInvestments ? userInvestments.map(inv => ({
            schemeName: inv?.schemeCode,
            amount: inv.amount,
            type: inv.investmentType,
            date: inv.createdAt
        })) : [];

        const totalIncome = tracker ? tracker.totalIncome : 0;
        const needsTarget = totalIncome * 0.50;
        const wantsTarget = totalIncome * 0.30;
        const savingsTarget = totalIncome * 0.20;

        const totalNeeds = tracker ? tracker.expenseSummary.totalNeedsSpent : 0;
        const totalWants = tracker ? tracker.expenseSummary.totalWantsSpent : 0;

        const totalExpense = totalNeeds + totalWants;
        const totalSpent = totalExpense;
        const totalOutflow = totalExpense + (totalInvestment || 0);
        const totalInvestmentAmount = totalInvestment || 0;
        const currentMonthBalance = totalIncome - totalExpense;

        const savingsGap = savingsTarget - totalInvestmentAmount;
        const isSavingsGoalMet = totalInvestmentAmount >= savingsTarget;

        return {
            walletBalance: wallet?.balance,
            income: totalIncome,
            incomeSources,
            mutualFundInvestedAmount: totalInvestment,
            totalInvestedAmount: totalInvestmentAmount,
            totalOutflow,
            investments,
            expenses,
            totalNeeds,
            totalWants,
            needsTarget,
            wantsTarget,
            savingsTarget,
            totalSpent,
            currentMonthBalance,
            savingsGap,
            isSavingsGoalMet
        };
    }
}
