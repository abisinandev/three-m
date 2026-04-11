import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";

export interface IOrder {
    _id: string;
    userId: string;
    symbol: string;

    side: OrderSide;
    orderType: OrderType;

    quantity: number;
    price?: number | null;
    stopLoss?: number | null;
    takeProfit?: number | null;

    status: OrderStatus;
    filledQty: number;

    executedPrice?: number | null;

    createdAt: Date;
    updatedAt: Date;
    executedAt?: Date | null;
}