import { IncomeSource } from "../types/expense-tracker.types";

export class Income {
    private readonly _amount: number;
    private readonly _source: IncomeSource;

    constructor(amount: number, source: IncomeSource) {
        if (amount <= 0) {
            throw new Error('Income amount must be greater than zero');
        }
        this._amount = amount;
        this._source = source;
    }

    get amount(): number {
        return this._amount;
    }

    get source(): IncomeSource {
        return this._source;
    }
}
