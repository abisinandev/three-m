import { Budget } from "./budget.vo";
import { Expense } from "./expense.vo";

export class ExpenseSummary {
    private readonly _totalNeedsSpent: number;
    private readonly _totalWantsSpent: number;
    private readonly _totalSavingsSpent: number;
    private readonly _needsUsagePercent: number;
    private readonly _wantsUsagePercent: number;
    private readonly _savingsUsagePercent: number;

    public constructor(
        needsSpent: number,
        wantsSpent: number,
        savingsSpent: number,
        needsUsage: number,
        wantsUsage: number,
        savingsUsage: number,
    ) {
        this._totalNeedsSpent = needsSpent;
        this._totalWantsSpent = wantsSpent;
        this._totalSavingsSpent = savingsSpent;
        this._needsUsagePercent = needsUsage;
        this._wantsUsagePercent = wantsUsage;
        this._savingsUsagePercent = savingsUsage;
    }

    static fromExpenses(expenses: Expense[], budget: Budget): ExpenseSummary {
        const needsSpent = expenses
            .filter(e => e.type === 'NEED')
            .reduce((sum, e) => sum + e.amount, 0);

        const wantsSpent = expenses
            .filter(e => e.type === 'WANT')
            .reduce((sum, e) => sum + e.amount, 0);

        const savingsSpent = expenses
            .filter(e => e.type === 'SAVING')
            .reduce((sum, e) => sum + e.amount, 0);

        const needsUsage = budget.needsLimit > 0
            ? (needsSpent / budget.needsLimit) * 100
            : 0;

        const wantsUsage = budget.wantsLimit > 0
            ? (wantsSpent / budget.wantsLimit) * 100
            : 0;
            
        const savingsUsage = budget.savingsTarget > 0
            ? (savingsSpent / budget.savingsTarget) * 100
            : 0;

        return new ExpenseSummary(
            needsSpent,
            wantsSpent,
            savingsSpent,
            needsUsage,
            wantsUsage,
            savingsUsage
        );
    }

    get totalNeedsSpent(): number {
        return this._totalNeedsSpent;
    }

    get totalWantsSpent(): number {
        return this._totalWantsSpent;
    }

    get totalSavingsSpent(): number {
        return this._totalSavingsSpent;
    }

    get needsUsagePercent(): number {
        return this._needsUsagePercent;
    }

    get wantsUsagePercent(): number {
        return this._wantsUsagePercent;
    }

    get savingsUsagePercent(): number {
        return this._savingsUsagePercent;
    }
}
