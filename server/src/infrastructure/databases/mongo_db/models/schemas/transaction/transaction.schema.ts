import { Schema, model, Document } from "mongoose";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";
import { ITransactionSchema } from "../../interfaces/transaction/transaction.schema.interface";

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

        paymentStatus: {
            type: String,
            enum: Object.values(TransactionStatus),
            required: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        fundId: {
            type: Schema.Types.ObjectId,
            ref: "Fund",
            default: null,
        },

        units: {
            type: Number,
            default: null,
        },//Not necessary to store units its make verdict

        txHash: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        signature: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        referenceType: {
            type: String,
            enum: Object.values(ReferenceType),
            required: true,
        },

        receipt_url: {
            type: String,
            default: null,
        },

        paymentIntentId: {
            type: String,
            // required: true,
            // unique: true,
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
