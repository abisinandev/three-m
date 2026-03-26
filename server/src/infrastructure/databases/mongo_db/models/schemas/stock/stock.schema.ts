import { model, Schema } from "mongoose";
import { IStock } from "../../interfaces/stocks/stock-schema-interface";

export type StockDocument = Document & IStock;

export const StockSchema = new Schema<StockDocument>(
    {
        symbol: {
            type: String,
            required: true,
            uppercase: true,
            index: true
        },

        logo: {
            type: String
        },
        exchange: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        isVisible: {
            type: Boolean,
            required: true,
            default: false
        },

        isTracked: {
            type: Boolean,
            required: true,
            default: true
        },

        isTradable: {
            type: Boolean,
            required: true,
            default: true,
        },

        sector: {
            type: String,
            required: true,
            default: 'Unknown',

        }
    },
    {
        timestamps: true
    }
);

StockSchema.index(
    { symbol: 1, exchange: 1 },
    { unique: true }
);

StockSchema.index({ name: 1 });

export const StockModel = model<StockDocument>("Stocks", StockSchema);