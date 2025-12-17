import { Schema, model, Document } from "mongoose";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { ITransactionSchema } from "../interfaces/transaction.schema.interface";
import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";

export type TransactionDocument = Document & ITransactionSchema;

const TransactionSchema = new Schema<TransactionDocument>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            enum: Object.values(CurrencyTypes),
            required: true,
        },

        type: {
            type: String,
            enum: Object.values(TransactionTypes),
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(TransactionStatus.SUCCESSFUL),
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        fundId: {
            type: String,
            default: null,
        },

        units: {
            type: Number,
            default: null,
        },

        txHash: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        referenceType: { type: String, enum: ReferenceType },
        receipt_url: { type: String },
    },
    {
        timestamps: true,
    }
);

export const TransactionModel = model<TransactionDocument>("Transaction", TransactionSchema);
