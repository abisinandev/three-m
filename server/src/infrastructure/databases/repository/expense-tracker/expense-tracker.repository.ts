import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { ExpenseTrackerEntity } from "@domain/entities/expense-tracker/expense-tracker.entity";
import { ExpenseTrackerDocument, ExpenseTrackerModel } from "@infrastructure/databases/mongo_db/models/schemas/expense-tracker/expense-tracker.schema";
import { ExpensetrackerMapper } from "@infrastructure/mappers/expense-tracker/expense-tracker.mapper";
import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { Expense } from "@domain/entities/expense-tracker/value-objects/expense.vo";

@injectable()
export class ExpenseTrackerRepository extends BaseRepository<ExpenseTrackerEntity, ExpenseTrackerDocument> implements IExpenseTrackerRepository {
    constructor() {
        super(ExpenseTrackerModel, ExpensetrackerMapper);
    }

    async totalIncome(userId: string): Promise<number> {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const tracker = await this.findOne({ userId, month: currentMonth });
        return tracker ? tracker.totalIncome : 0;
    }

    async addExpense(userId: string, dto: Expense): Promise<ExpenseTrackerEntity | null> {
        const currentMonth = new Date().toISOString().slice(0, 7);

        const expenseData = {
            amount: dto.amount,
            category: dto.category,
            type: dto.type,
            description: dto.description,
            date: dto.date,
            paymentMode: dto.paymentMode
        };

        const updatedDoc = await this.model.findOneAndUpdate(
            { userId, month: currentMonth },
            {
                $push: { expenses: expenseData },
            },
            { new: true }
        );

        if (!updatedDoc) return null;

        return this.mapper.toDomain(updatedDoc);
    }

}
