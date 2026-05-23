import { ExpenseType, PaymentMode } from "@application/dto/expense-tracker/add-expense.dto";

export class Expense {
    private readonly _amount: number;
    private readonly _category: string;
    private readonly _type: ExpenseType;
    private readonly _description?: string;
    private readonly _date: Date;
    private readonly _paymentMode?: PaymentMode;

    constructor(params: {
        amount: number;
        category: string;
        type: ExpenseType;
        description?: string;
        date: Date;
        paymentMode?: PaymentMode;
    }) {
        if (params.amount <= 0) {
            throw new Error('Expense amount must be greater than zero');
        }

        this._amount = params.amount;
        this._category = params.category;
        this._type = params.type;
        this._description = params.description;
        this._date = params.date;
        this._paymentMode = params.paymentMode;
    }

    get amount(): number {
        return this._amount;
    }

    get category(): string {
        return this._category;
    }

    get type(): ExpenseType {
        return this._type;
    }

    get description(): string | undefined {
        return this._description;
    }

    get date(): Date {
        return this._date;
    }

    get paymentMode(): PaymentMode | undefined {
        return this._paymentMode;
    }
}
