import { model, Schema } from "mongoose";
import { IStock } from "../../interfaces/stocks/stock-schema-interface";
import { StocksStatus } from "@domain/entities/stock/stocks.enum";

export type StockDocument = Document & IStock;

export const StockSchema = new Schema<StockDocument>(
    {
        symbol: {
            type: String,
            required: true,
            uppercase: true,
            index: true
        },

        exchange: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: Object.values(StocksStatus),
            default: StocksStatus.ACTIVE
            // required:true,
        },

        isTradable: {
            type: Boolean,
            required: true,
        },

        sector: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const StockModel = model<StockDocument>("Stocks", StockSchema);