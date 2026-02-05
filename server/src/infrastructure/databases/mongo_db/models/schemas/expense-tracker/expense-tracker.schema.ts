import { Schema, model } from 'mongoose';
import { ExpenseTrackerDocument } from '../../interfaces/expense-tracker/expense-tracker-schema.interface';

const ExpenseTrackerSchema = new Schema<ExpenseTrackerDocument>(
    {
        userId: { type: String, required: true },
        month: { type: String, required: true },
        incomes: [
            {
                amount: Number,
                source: String,
            }
        ],
        budget: {
            needsLimit: { type: Number, },
            wantsLimit: { type: Number },
            savingsTarget: { type: Number },
        },
        expenses: [
            {
                amount: Number,
                category: String,
                type: { type: String },
                description: String,
                date: Date,
                paymentMode: String,
            },
        ],
        expenseSummary: {
            needsSpent: { type: Number },
            wantsSpent: { type: Number },
            needsUsage: { type: Number },
            wantsUsage: { type: Number },
        },
        savingsStatus: {
            target: { type: Number },
            actual: { type: Number },
            gap: { type: Number },
            status: { type: String }
        }
    },
    { timestamps: true }
);

ExpenseTrackerSchema.index(
    { userId: 1, month: 1 },
    { unique: true }
)

export { ExpenseTrackerDocument };
export const ExpenseTrackerModel = model<ExpenseTrackerDocument>(
    'ExpenseTracker',
    ExpenseTrackerSchema
);
