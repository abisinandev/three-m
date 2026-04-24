import { model, Schema } from "mongoose";
import { IOrder } from "../../interfaces/stocks/order-schema.interface";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";

export type OrderDocument = IOrder & Document;

export const OrderSchema = new Schema<OrderDocument>(
    {
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

        orderType: {
            type: String,
            enum: Object.values(OrderType),
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
        limitPrice: {
            type: Number,
            default: null,
        },
        stopLoss: {
            type: Number,
            default: null,
        },
        takeProfit: {
            type: Number,
            default: null,
        },


        status: {
            type: String,
            enum: Object.values(OrderStatus),
            required: true,
            default: OrderStatus.OPEN,
            index: true,
        },

        filledQty: {
            type: Number,
            default: 0,
        },

        executedPrice: {
            type: Number,
            default: null,
        },

        executedAt: {
            type: Date,
            default: null,
        },
        isAlgoTrade: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

OrderSchema.index({ status: 1, symbol: 1, limitPrice: 1 });

export const OrderModel = model<OrderDocument>('Orders', OrderSchema) 