import { Income } from "./income.vo";

export class Budget {
    private readonly _needsLimit: number;
    private readonly _wantsLimit: number;
    private readonly _savingsTarget: number;

    constructor(
        needsLimit: number,
        wantsLimit: number,
        savingsTarget: number
    ) {
        this._needsLimit = needsLimit;
        this._wantsLimit = wantsLimit;
        this._savingsTarget = savingsTarget;
    }

    static fromIncome(income: Income): Budget {
        return this.fromIncomeTotal(income.amount);
    }

    static fromIncomeTotal(amount: number): Budget {
        return new Budget(
            amount * 0.5,
            amount * 0.3,
            amount * 0.2
        );
    }

    get needsLimit(): number {
        return this._needsLimit;
    }

    get wantsLimit(): number {
        return this._wantsLimit;
    }

    get savingsTarget(): number {
        return this._savingsTarget;
    }
}
