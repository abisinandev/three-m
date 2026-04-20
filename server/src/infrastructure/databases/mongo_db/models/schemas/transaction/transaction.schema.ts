import { Schema, model, Document } from "mongoose";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { ITransactionSchema } from "../../interfaces/transaction/transaction.schema.interface";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";

export type TransactionDocument = Document & ITransactionSchema;

const TransactionSchema = new Schema<TransactionDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
            immutable: true,
        },
        userCode: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(TransactionTypes),
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(TransactionStatus),
            required: true,
        },

        fundId: {
            type: Schema.Types.ObjectId,
            ref: "Fund",
            default: null,
        },

        referenceType: {
            type: String,
            enum: Object.values(TransactionReferenceType),
            required: true,
        },

        referenceId: { trpe: String },

        receipt_url: {
            type: String,
            default: null,
        },

        paymentIntentId: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

export const TransactionModel = model<TransactionDocument>(
    "Transaction",
    TransactionSchema
);
