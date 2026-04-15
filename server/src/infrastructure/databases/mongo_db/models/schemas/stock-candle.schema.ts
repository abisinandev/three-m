import mongoose, { Schema, Document } from "mongoose";
import { ICandle } from "../interfaces/stocks/stock-candle-schema.interface";

export interface CandleDocument extends ICandle, Document {}

const CandleSchema: Schema = new Schema(
    {
        symbol: { type: String, required: true, index: true },
        timeframe: { type: String, required: true, index: true },
        time: { type: Number, required: true },
        open: { type: Number, required: true },
        high: { type: Number, required: true },
        low: { type: Number, required: true },
        close: { type: Number, required: true },
        volume: { type: Number, required: true },
    },
    { timestamps: true }
);

// Compound index for fast querying and uniqueness
CandleSchema.index({ symbol: 1, timeframe: 1, time: 1 }, { unique: true });

export const CandleModel = mongoose.model<CandleDocument>("Candle", CandleSchema);
