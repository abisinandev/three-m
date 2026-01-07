import { Schema, model } from "mongoose";
import { MutualFundNavDocument } from "../interfaces/mutual-fund.schema.interface";

const MutualFundNavSchema = new Schema<MutualFundNavDocument>(
    {
        schemeCode: {
            type: String,
            required: true,
            trim: true,
            index: true,
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

        source: {
            type: String,
            enum: ["MFAPI"],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

MutualFundNavSchema.index(
    { schemeCode: 1, navDate: 1 },
    { unique: true }
);

export const MutualFundNavModel = model<MutualFundNavDocument>(
    "MutualFundNav",
    MutualFundNavSchema
);
