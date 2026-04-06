import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";

export interface ITrade {
    _id: string;
    orderId: string;
    userId: string;
    symbol: string;
    side: OrderSide;
    quantity: number;
    price: number;
    profit?: number;
    createdAt: Date;
    updatedAt: Date;
}
