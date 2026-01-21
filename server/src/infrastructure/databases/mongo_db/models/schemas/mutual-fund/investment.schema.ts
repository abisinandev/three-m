import { Schema, model } from "mongoose";
import { InvestmentStatus, InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";
import { InvestmentDocument } from "../../interfaces/mutual-fund/investment.schema.interface";

const InvestmentSchema = new Schema<InvestmentDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            // required: true,
            ref: "User",
            index: true,
        },

        sipInstallmentId: {
            type: Schema.Types.ObjectId,
            ref:"SipInstallment",
        },
        
        schemeCode: {
            type: String,
            // required: true,
            index: true,
            trim: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        units: {
            type: Number,
            // required: true,
            min: 0,
        },

        nav: {
            type: Number,
            // required: true,
            min: 0,
        },

        navDate: {
            type: Date,
            // required: true,
        },

        remainingUnits: {
            type: Number,
            // required: true,
            min: 0,
            index: true,
        },

        redeemedUnits: {
            type: Number,
            min: 0,
        },

        redeemedAt: {
            type: Date,
        },

        status: {
            type: String,
            enum: Object.values(InvestmentStatus),
            // required: true,
            index: true,
        },

        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            // required: true,
        },

        investmentType: {
            type: String,
            enum: Object.values(InvestmentType),
            // required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const InvestmentModel = model<InvestmentDocument>(
    "Investment",
    InvestmentSchema
);
