import { FundCategory } from "@domain/enum/funds/fund-category.enum";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { SubCategory } from "@domain/enum/funds/fund-sub-category.enum";
import { Schema, model } from "mongoose";
import { MutualFundDocument } from "../../interfaces/mutual-fund/mutual-fund-schema.interface";
import { RiskLevel } from "@domain/enum/funds/fund-risk-level.enum";

const MutualFundSchema = new Schema<MutualFundDocument>(
    {
        schemeCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        schemeName: {
            type: String,
            required: true,
            trim: true,
        },
        source: {
            type: String,
            // required: true,
        },
        amc: {
            type: String,
            // required: true,
            trim: true,
        },

        category: {
            type: String,
            enum: Object.values(FundCategory),
            // required: true,
        },

        subCategory: {
            type: String,
            enum: Object.values(SubCategory),
            // required: true,
        },

        risk: {
            type: String,
            enum: Object.values(RiskLevel),
            // required: true,
        },

        status: {
            type: String,
            enum: Object.values(FundStatus),
            default: FundStatus.ACTIVE,
        },

        logo: {
            type: String,
        }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const MutualFundModel = model<MutualFundDocument>("MutualFund", MutualFundSchema);