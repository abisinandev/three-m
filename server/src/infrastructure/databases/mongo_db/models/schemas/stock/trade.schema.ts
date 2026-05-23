import { model, Schema, Document } from "mongoose";
import { ITrade } from "../../interfaces/stocks/trade-schema.interface";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";

export type TradeDocument = ITrade & Document;

export const TradeSchema = new Schema<TradeDocument>(
    {
        orderId: {
            type: String,
            required: true,
        },

        userId: {
            type: String,
            required: true,
            index: true,
        },

        symbol: {
            type: String,
            required: true,
            index: true,
        },

        side: {
            type: String,
            enum: Object.values(OrderSide),
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        price: {
            type: Number,
            required: true,
        },
        profit: {
            type: Number,
            required: false,
        },
        isAlgoTrade: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);


TradeSchema.index({ userId: 1, createdAt: -1 });
TradeSchema.index({ symbol: 1, createdAt: -1 });
TradeSchema.index({ orderId: 1 });

export const TradeModel = model<TradeDocument>('Trades', TradeSchema)
