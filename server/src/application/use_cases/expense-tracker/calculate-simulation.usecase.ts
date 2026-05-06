import { inject, injectable } from "inversify";
import { ICalculateSimulationUseCase } from "./interfaces/calculate-simulation.usecase.interface";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { SimulationRequestDTO, SimulationResultDTO, AdjustmentType } from "@application/dto/expense-tracker/simulation-request.dto";
import { generateInsights } from "@shared/utils/expense-tracker/insight-engine";
import { ExpenseTrackerDTO } from "@application/dto/expense-tracker/expense-tracker-response.dto";


@injectable()
export class CalculateSimulationUseCase implements ICalculateSimulationUseCase {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository) private readonly _expenseTrackerRepository: IExpenseTrackerRepository,
    ) { }

    async execute(userId: string, data: SimulationRequestDTO): Promise<SimulationResultDTO> {
        const month = data.month || new Date().toISOString().slice(0, 7);

        const tracker = await this._expenseTrackerRepository.findOne({ userId, month });

        const originalIncome = tracker ? tracker.totalIncome : 0;
        const originalNeedsSpent = tracker ? tracker.expenseSummary.totalNeedsSpent : 0;
        const originalWantsSpent = tracker ? tracker.expenseSummary.totalWantsSpent : 0;
        const originalSpent = originalNeedsSpent + originalWantsSpent;
        const originalProjectedSavings = originalIncome - originalSpent;

        const originalDto = {
            income: originalIncome,
            incomeSources: tracker ? tracker.incomes.map(inc => ({ source: inc.source, amount: inc.amount })) : [],
            expenses: tracker ? tracker.expenses.map(exp => ({
                amount: exp.amount,
                category: exp.category,
                type: exp.type,
                description: exp.description,
                date: exp.date,
                paymentMode: exp.paymentMode
            })) : [],
            totalNeeds: originalNeedsSpent,
            totalWants: originalWantsSpent,
            totalSavings: Math.max(0, originalProjectedSavings), // Use projected savings
            needsTarget: originalIncome * 0.50,
            wantsTarget: originalIncome * 0.30,
            savingsTarget: originalIncome * 0.20,
            totalSpent: originalSpent,
            currentMonthBalance: originalProjectedSavings,
            healthScore: Math.round(generateInsights({
                totalSpent: originalSpent,
                lastMonthSpent: originalSpent,
                percentageChange: 0,
                topCategory: 'N/A',
                topCategoryChange: 0,
                spendingRatio: originalIncome > 0 ? originalSpent / originalIncome : 0,
                investmentRatio: 0,
                needsRatio: originalIncome > 0 ? originalNeedsSpent / originalIncome : 0,
                wantsRatio: originalIncome > 0 ? originalWantsSpent / originalIncome : 0
            }).healthScore)
        } as ExpenseTrackerDTO;

        let simulatedIncome = originalIncome;
        let simulatedNeeds = originalNeedsSpent;
        let simulatedWants = originalWantsSpent;

        for (const adj of data.adjustments) {
            if (adj.type === AdjustmentType.INCOME) {
                simulatedIncome += adj.amount;
            } else if (adj.type === AdjustmentType.CATEGORY) {
                if (adj.categoryType === 'NEED') simulatedNeeds += adj.amount;
                if (adj.categoryType === 'WANT') simulatedWants += adj.amount;
            }
        }

        const simulatedNeedsTarget = simulatedIncome * 0.50;
        const simulatedWantsTarget = simulatedIncome * 0.30;
        const simulatedSavingsTarget = simulatedIncome * 0.20;

        const simulatedSpent = Math.max(0, simulatedNeeds) + Math.max(0, simulatedWants);
        const simulatedBalance = simulatedIncome - simulatedSpent;
        const simulatedProjectedSavings = simulatedBalance; // All leftover is projected savings

        const simulatedDto = {
            ...originalDto,
            income: simulatedIncome,
            totalNeeds: Math.max(0, simulatedNeeds),
            totalWants: Math.max(0, simulatedWants),
            totalSavings: Math.max(0, simulatedProjectedSavings),
            needsTarget: simulatedNeedsTarget,
            wantsTarget: simulatedWantsTarget,
            savingsTarget: simulatedSavingsTarget,
            totalSpent: simulatedSpent,
            currentMonthBalance: simulatedBalance,
            healthScore: Math.round(generateInsights({
                totalSpent: simulatedSpent,
                lastMonthSpent: originalSpent,
                percentageChange: originalSpent > 0 ? ((simulatedSpent - originalSpent) / originalSpent) * 100 : 0,
                topCategory: 'N/A',
                topCategoryChange: 0,
                spendingRatio: simulatedIncome > 0 ? simulatedSpent / simulatedIncome : 0,
                investmentRatio: 0,
                needsRatio: simulatedIncome > 0 ? simulatedNeeds / simulatedIncome : 0,
                wantsRatio: simulatedIncome > 0 ? simulatedWants / simulatedIncome : 0
            }).healthScore)
        } as ExpenseTrackerDTO;

        const impact = {
            savingsChange: Number(simulatedDto.totalSavings) - Number(originalDto.totalSavings),
            balanceChange: simulatedDto.currentMonthBalance - originalDto.currentMonthBalance,
            isBetter: (Number(simulatedDto.totalSavings) > Number(originalDto.totalSavings)) || (simulatedDto.currentMonthBalance > originalDto.currentMonthBalance)
        };

        return {
            original: originalDto,
            simulated: simulatedDto,
            impact
        };
    }
}

