import { ExpenseTrackerEntity } from "@domain/entities/expense-tracker/expense-tracker.entity";
import { Budget } from "@domain/entities/expense-tracker/value-objects/budget.vo";
import { Expense } from "@domain/entities/expense-tracker/value-objects/expense.vo";
import { Income } from "@domain/entities/expense-tracker/value-objects/income.vo";
import { ExpenseSummary } from "@domain/entities/expense-tracker/value-objects/expense-summery.vo";
import { SavingsStatus } from "@domain/entities/expense-tracker/value-objects/saving-status";
import { ExpenseTrackerDocument } from "@infrastructure/databases/mongo_db/models/interfaces/expense-tracker/expense-tracker-schema.interface";

export const toDomain = (doc: ExpenseTrackerDocument): ExpenseTrackerEntity => {
    return ExpenseTrackerEntity.fromPersistence({
        id: doc.id,
        userId: doc.userId,
        month: doc.month,

        incomes: doc.incomes.map(
            i => new Income(i.amount, i.source as any)
        ),

        budget: new Budget(
            doc.budget.needsLimit,
            doc.budget.wantsLimit,
            doc.budget.savingsTarget,
        ),

        expenses: doc.expenses.map(
            e =>
                new Expense({
                    amount: e.amount,
                    category: e.category,
                    type: e.type,
                    description: e.description,
                    date: e.date,
                    paymentMode: e.paymentMode,
                })
        ),
        expenseSummary: new ExpenseSummary(
            doc.expenseSummary.needsSpent,
            doc.expenseSummary.wantsSpent,
            doc.expenseSummary.savingsSpent ?? 0,
            doc.expenseSummary.needsUsage,
            doc.expenseSummary.wantsUsage,
            doc.expenseSummary.savingsUsage ?? 0,
        ),

        savingsStatus: new SavingsStatus(
            doc.savingsStatus.target,
            doc.savingsStatus.actual,
            doc.savingsStatus.gap,
            doc.savingsStatus.status
        ),

        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    });
}

export const toPersistance = (entity: ExpenseTrackerEntity): Partial<ExpenseTrackerDocument> => {
    return {
        userId: entity.userId,
        month: entity.month,
        incomes: entity.incomes.map(i => ({
            amount: i.amount,
            source: i.source,
        })),
        budget: {
            needsLimit: entity.budget.needsLimit,
            wantsLimit: entity.budget.wantsLimit,
            savingsTarget: entity.budget.savingsTarget,
        },
        expenses: entity.expenses.map(e => ({
            amount: e.amount,
            category: e.category,
            type: e.type,
            description: e.description,
            date: e.date,
            paymentMode: e.paymentMode,
        })),
        expenseSummary: {
            needsSpent: entity.expenseSummary.totalNeedsSpent,
            wantsSpent: entity.expenseSummary.totalWantsSpent,
            needsUsage: entity.expenseSummary.needsUsagePercent,
            wantsUsage: entity.expenseSummary.wantsUsagePercent,
            savingsSpent: entity.expenseSummary.totalSavingsSpent,
            savingsUsage: entity.expenseSummary.savingsUsagePercent,
        },
        savingsStatus: {
            target: entity.savingsStatus.targetAmount,
            actual: entity.savingsStatus.actualAmount,
            gap: entity.savingsStatus.gapAmount,
            status: entity.savingsStatus.status,
        },
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
    };
}

export const ExpensetrackerMapper = {
    toDomain,
    toPersistance
}