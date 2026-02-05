import { Budget } from "./budget.vo";
import { Expense } from "./expense.vo";

export class ExpenseSummary {
    private readonly _totalNeedsSpent: number;
    private readonly _totalWantsSpent: number;
    private readonly _needsUsagePercent: number;
    private readonly _wantsUsagePercent: number;

    public constructor(
        needsSpent: number,
        wantsSpent: number,
        needsUsage: number,
        wantsUsage: number
    ) {
        this._totalNeedsSpent = needsSpent;
        this._totalWantsSpent = wantsSpent;
        this._needsUsagePercent = needsUsage;
        this._wantsUsagePercent = wantsUsage;
    }

    static fromExpenses(expenses: Expense[], budget: Budget): ExpenseSummary {
        const needsSpent = expenses
            .filter(e => e.type === 'NEED')
            .reduce((sum, e) => sum + e.amount, 0);

        const wantsSpent = expenses
            .filter(e => e.type === 'WANT')
            .reduce((sum, e) => sum + e.amount, 0);

        const needsUsage = budget.needsLimit > 0
            ? (needsSpent / budget.needsLimit) * 100
            : 0;

        const wantsUsage = budget.wantsLimit > 0
            ? (wantsSpent / budget.wantsLimit) * 100
            : 0;

        return new ExpenseSummary(
            needsSpent,
            wantsSpent,
            needsUsage,
            wantsUsage
        );
    }

    get totalNeedsSpent(): number {
        return this._totalNeedsSpent;
    }

    get totalWantsSpent(): number {
        return this._totalWantsSpent;
    }

    get needsUsagePercent(): number {
        return this._needsUsagePercent;
    }

    get wantsUsagePercent(): number {
        return this._wantsUsagePercent;
    }
}
