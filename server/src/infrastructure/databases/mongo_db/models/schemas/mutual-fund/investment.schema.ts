import { Schema, model, Types } from "mongoose";
import { InvestmentStatus, InvestmentType } from "@domain/enum/funds/investment.enums";
import { InvestmentDocument } from "../../interfaces/mutual-fund/investment.schema.interface";

const InvestmentSchema = new Schema<InvestmentDocument  >(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
            index: true,
        },

        schemeCode: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },

        type: {
            type: String,
            enum: Object.values(InvestmentType),
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        units: {
            type: Number,
            required: true,
            min: 0,
        },

        nav: {
            type: Number,
            required: true,
            min: 0,
        },

        navDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(InvestmentStatus),
            default: InvestmentStatus.PENDING,
            index: true,
        },
    },
    {
        timestamps: true, 
        versionKey: false,
    }
);


export const InvestmentModel = model<InvestmentDocument>("Investment",InvestmentSchema)