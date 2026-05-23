import { ValidationError } from "@presentation/express/utils/error-handling";
import { Budget } from "./value-objects/budget.vo";
import { ExpenseSummary } from "./value-objects/expense-summery.vo";
import { Expense } from "./value-objects/expense.vo";
import { Income } from "./value-objects/income.vo";
import { SavingsStatus } from "./value-objects/saving-status";

export class ExpenseTrackerEntity {
    private readonly _id: string | undefined;
    private readonly _userId: string;
    private readonly _month: string;

    private _incomes: Income[];
    private _budget: Budget;
    private _expenses: Expense[];

    private _expenseSummary: ExpenseSummary;
    private _savingsStatus: SavingsStatus;

    private readonly _createdAt: Date;
    private _updatedAt: Date;

    private constructor(params: {
        id?: string;
        userId: string;
        month: string;

        incomes: Income[];
        budget: Budget;
        expenses: Expense[];

        expenseSummary: ExpenseSummary;
        savingsStatus: SavingsStatus;

        createdAt: Date;
        updatedAt: Date;
    }) {
        this._id = params.id;
        this._userId = params.userId;
        this._month = params.month;

        this._incomes = params.incomes;
        this._budget = params.budget;
        this._expenses = params.expenses;

        this._expenseSummary = params.expenseSummary;
        this._savingsStatus = params.savingsStatus;

        this._createdAt = params.createdAt;
        this._updatedAt = params.updatedAt;
    }

    addExpense(expense: Expense): void {
        this._expenses.push(expense);
        this.recalculate();
    }

    addIncomeSource(income: Income): void {
        this._incomes.push(income);
        this._budget = Budget.fromIncomeTotal(this.totalIncome);
        this.recalculate();
    }

    applyInvestments(totalInvested: number): void {
        this._savingsStatus = SavingsStatus.fromActual(
            this._budget.savingsTarget,
            totalInvested
        );
        this._updatedAt = new Date();
    }

    static create(data: {
        userId: string;
        month: string;
        income: Income;
        expenses?: Expense[];
        createdAt?: Date;
    }): ExpenseTrackerEntity {
        const expenses = data.expenses ?? [];
        const incomes = [data.income];
        const budget = Budget.fromIncomeTotal(data.income.amount);
        const expenseSummary = ExpenseSummary.fromExpenses(expenses, budget);
        const savingsStatus = SavingsStatus.empty(budget.savingsTarget);

        const now = data.createdAt ?? new Date();

        return new ExpenseTrackerEntity({
            userId: data.userId,
            month: data.month,

            incomes,
            budget,
            expenses,

            expenseSummary,
            savingsStatus,

            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPersistence(data: {
        id: string;
        userId: string;
        month: string;

        incomes: Income[];
        budget: Budget;
        expenses: Expense[];

        expenseSummary: ExpenseSummary;
        savingsStatus: SavingsStatus;

        createdAt: Date;
        updatedAt: Date;
    }): ExpenseTrackerEntity {
        return new ExpenseTrackerEntity({
            id: data.id,
            userId: data.userId,
            month: data.month,

            incomes: data.incomes,
            budget: data.budget,
            expenses: data.expenses,

            expenseSummary: data.expenseSummary,
            savingsStatus: data.savingsStatus,

            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    private recalculate(): void {
        this._expenseSummary = ExpenseSummary.fromExpenses(
            this._expenses,
            this._budget
        );
        this._updatedAt = new Date();
    }

    removeExpenseAt(index: number): void {
        if (index < 0 || index >= this._expenses.length) {
            throw new ValidationError('Invalid expense index');
        }
        this._expenses.splice(index, 1);
        this.recalculate();
    }

    get id(): string | undefined {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get month(): string {
        return this._month;
    }

    get incomes(): Income[] {
        return [...this._incomes];
    }

    get totalIncome(): number {
        return this._incomes.reduce((sum, i) => sum + i.amount, 0);
    }

    get budget(): Budget {
        return this._budget;
    }

    get expenses(): Expense[] {
        return [...this._expenses];
    }

    get expenseSummary(): ExpenseSummary {
        return this._expenseSummary;
    }

    get savingsStatus(): SavingsStatus {
        return this._savingsStatus;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }
}
