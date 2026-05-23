import { Document, Schema, model } from "mongoose";
import { IQuote } from "../../interfaces/stocks/quote-schema.interface";

export type QuoteDocument = IQuote & Document

const QuoteSchema = new Schema<QuoteDocument>(
    {
        symbol: { type: String, required: true },
        price: Number,
        open: Number,
        high: Number,
        low: Number,
        volume: Number,
        latestTradingDay: Date
    },
    { timestamps: true }
);

export const QuoteModel = model("Quote", QuoteSchema); 