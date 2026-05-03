import mongoose, { Schema, Document } from "mongoose";

export interface AlgoStrategyConfigDocument extends Document {
    strategyName: string;
    riskAmount: number;
    maxTradesPerDay: number;
    stopLoss: number;
    takeProfit: number;
    createdAt: Date;
    updatedAt: Date;
}

const algoStrategyConfigSchema = new Schema<AlgoStrategyConfigDocument>(
    {
        strategyName: {
            type: String,
            required: true,
            unique: true,
        },
        riskAmount: {
            type: Number,
            required: true,
            default: 1000,
        },
        maxTradesPerDay: {
            type: Number,
            required: true,
            default: 5,
        },
        stopLoss: {
            type: Number,
            required: true,
            default: 100,
        },
        takeProfit: {
            type: Number,
            required: true,
            default: 200,
        },
    },
    {
        timestamps: true,
    }
);

export const AlgoStrategyConfigModel = mongoose.model<AlgoStrategyConfigDocument>(
    "AlgoStrategyConfig",
    algoStrategyConfigSchema
);
