import { MfCAGRDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/cagr.schema.interface";
import { Schema, model } from "mongoose";

/**
 * Stores derived performance metrics (CAGR)
 * One document per schemeCode
 */

const MfCAGRSchema = new Schema<MfCAGRDocument>(
    {
        schemeCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        cagr1Y: {
            type: Number,
        },

        cagr3Y: {
            type: Number,
        },

        cagr5Y: {
            type: Number,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const MfCAGRModel = model<MfCAGRDocument>(
    "MutualFundCAGR",
    MfCAGRSchema
);
