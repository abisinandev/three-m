import { OrderSide } from "./enum/order-side.enum";
import { OrderStatus } from "./enum/order-status.enum";
import { OrderType } from "./enum/order-type.enum";

export class OrderEntity {
    public id: string | null;
    public userId: string;
    public symbol: string;
    public side: OrderSide;
    public orderType: OrderType;
    public quantity: number;
    public price: number;
    public limitPrice: number | null;
    public stopLoss: number | null;
    public takeProfit: number | null;
    public isAlgoTrade: boolean;
    public status: OrderStatus;
    public filledQty: number;
    public executedPrice: number | null;
    public createdAt: Date;
    public updatedAt: Date;
    public executedAt: Date | null;

    private constructor(props: {
        id?: string | null;
        userId: string;
        symbol: string;
        side: OrderSide;
        orderType: OrderType;
        quantity: number;
        isAlgoTrade: boolean;
        price: number;
        limitPrice?: number | null;
        status: OrderStatus;
        filledQty?: number;
        executedPrice?: number | null;
        stopLoss?: number | null;
        takeProfit?: number | null;
        createdAt?: Date;
        updatedAt?: Date;
        executedAt?: Date | null;
    }) {
        this.id = props.id ?? null;
        this.userId = props.userId;
        this.symbol = props.symbol;
        this.side = props.side;
        this.orderType = props.orderType;
        this.quantity = props.quantity;
        this.price = props.price;
        this.limitPrice = props.limitPrice ?? null;
        this.stopLoss = props.stopLoss ?? null;
        this.takeProfit = props.takeProfit ?? null;
        this.isAlgoTrade = props.isAlgoTrade;
        this.status = props.status;
        this.filledQty = props.filledQty ?? 0;
        this.executedPrice = props.executedPrice ?? null;
        this.createdAt = props.createdAt ?? new Date();
        this.updatedAt = props.updatedAt ?? new Date();
        this.executedAt = props.executedAt ?? null;
    }


    static create(data: {
        userId: string;
        symbol: string;
        side: OrderSide;
        orderType: OrderType;
        status: OrderStatus;
        quantity: number;
        price: number;
        limitPrice?: number;
        isAlgoTrade: boolean;
        stopLoss?: number;
        takeProfit?: number;
    }): OrderEntity {

        return new OrderEntity({
            userId: data.userId,
            symbol: data.symbol,
            side: data.side,
            orderType: data.orderType,
            quantity: data.quantity,
            price: data.price,
            limitPrice: data.limitPrice ?? null,
            stopLoss: data.stopLoss ?? null,
            takeProfit: data.takeProfit ?? null,
            status: data.status,
            isAlgoTrade: data.isAlgoTrade,
        });

    }

    static fromPersistence(data: {
        id: string;
        userId: string;
        symbol: string;
        side: OrderSide;
        orderType: OrderType; 
        quantity: number;
        price: number;
        limitPrice?: number | null;
        stopLoss?: number | null;
        takeProfit?: number | null;
        status: OrderStatus;
        isAlgoTrade: boolean;
        filledQty: number;
        executedPrice: number | null;
        createdAt: Date;
        updatedAt: Date;
        executedAt: Date | null;

    }): OrderEntity {
        return new OrderEntity({
            id: data.id,
            userId: data.userId,
            symbol: data.symbol,
            side: data.side,
            orderType: data.orderType,
            quantity: data.quantity,
            price: data.price,
            limitPrice: data.limitPrice ?? null,
            stopLoss: data.stopLoss ?? null,
            takeProfit: data.takeProfit ?? null,
            status: data.status,
            isAlgoTrade: data.isAlgoTrade,
            filledQty: data.filledQty,
            executedPrice: data.executedPrice,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            executedAt: data.executedAt,
        });

    }

    markFilled() {
        this.status = OrderStatus.FILLED;
        this.filledQty = this.quantity;
        this.executedAt = new Date();
        this.updatedAt = new Date();
    }

    markCancelled() {
        this.status = OrderStatus.CANCELLED;
        this.updatedAt = new Date();
    }

    cancel() {
        this.status = OrderStatus.CANCELLED;
        this.updatedAt = new Date();
    }

    updateFilledQty(qty: number, price: number) {
        this.filledQty = qty;
        this.executedPrice = price;

        if (qty >= this.quantity) {
            this.status = OrderStatus.FILLED;
            this.executedAt = new Date();
        }

        this.updatedAt = new Date();
    }

    toPersistence() {
        return {
            id: this.id,
            userId: this.userId,
            symbol: this.symbol,
            side: this.side,
            orderType: this.orderType,
            quantity: this.quantity,
            price: this.price,
            limitPrice: this.limitPrice,
            stopLoss: this.stopLoss,
            takeProfit: this.takeProfit,
            status: this.status,
            filledQty: this.filledQty,
            executedPrice: this.executedPrice,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            executedAt: this.executedAt,
            isAlgoTrade: this.isAlgoTrade,
        };
    }

    toJSON() {
        return this.toPersistence();
    }
}
