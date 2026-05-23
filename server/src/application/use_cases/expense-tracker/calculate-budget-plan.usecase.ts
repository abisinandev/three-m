import { injectable } from "inversify";
import { ICalculateBudgetPlanUseCase } from "./interfaces/calculate-budget-plan.usecase.interface";
import { BudgetPlanRequestDTO, BudgetPlanResultDTO } from "@application/dto/expense-tracker/budget-plan.dto";
import { generateInsights } from "@shared/utils/expense-tracker/insight-engine";

@injectable()
export class CalculateBudgetPlanUseCase implements ICalculateBudgetPlanUseCase {

    async execute(_userId: string, data: BudgetPlanRequestDTO): Promise<BudgetPlanResultDTO> {
        const { income, needsTotal, wantsTotal, savingsTotal } = data;

        const totalSpent = needsTotal + wantsTotal;
        const remaining = income - totalSpent - savingsTotal;

        const safePct = (val: number) => income > 0 ? (val / income) * 100 : 0;

        const insightResult = generateInsights({
            totalSpent,
            lastMonthSpent: totalSpent,
            percentageChange: 0,
            topCategory: 'N/A',
            topCategoryChange: 0,
            spendingRatio: income > 0 ? totalSpent / income : 0,
            investmentRatio: income > 0 ? savingsTotal / income : 0,
            needsRatio: income > 0 ? needsTotal / income : 0,
            wantsRatio: income > 0 ? wantsTotal / income : 0
        });

        const getHealthLabel = (score: number) => {
            if (score >= 80) return { label: 'Excellent', color: '#00C853', grade: 'EXCELLENT' };
            if (score >= 60) return { label: 'Healthy', color: '#3B82F6', grade: 'GOOD' };
            if (score >= 40) return { label: 'Fair', color: '#f59e0b', grade: 'FAIR' };
            return { label: 'At Risk', color: '#F43F5E', grade: 'POOR' };
        };

        const healthMeta = getHealthLabel(insightResult.healthScore);

        return {
            allocation: {
                needsPct: safePct(needsTotal),
                wantsPct: safePct(wantsTotal),
                savingsPct: safePct(savingsTotal),
                totalSpent,
                remaining
            },
            health: {
                score: insightResult.healthScore,
                ...healthMeta
            },
            insights: insightResult.insights
        };
    }
}
