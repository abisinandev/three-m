import { OrderSide } from "./enum/order-side.enum";
import { OrderStatus } from "./enum/order-status.enum";
import { OrderType } from "./enum/order-type.enum";

export class OrderEntity {
    private readonly _id?: string | null;
    private readonly _userId: string;
    private readonly _symbol: string;
    private readonly _side: OrderSide;
    private readonly _orderType: OrderType;
    private readonly _quantity: number;
    private readonly _price: number;
    private readonly _stopLoss?: number | null;
    private readonly _takeProfit?: number | null;
    private readonly _isAlgoTrade: boolean;

    private _status: OrderStatus;
    private _filledQty: number;
    private _executedPrice?: number | null;

    private readonly _createdAt: Date;
    private _updatedAt: Date;
    private _executedAt?: Date | null;

    private constructor(props: {
        id?: string | null;
        userId: string;
        symbol: string;
        side: OrderSide;
        orderType: OrderType;
        quantity: number;
        isAlgoTrade: boolean;
        price: number;
        status: OrderStatus;
        filledQty?: number;
        executedPrice?: number | null;
        stopLoss?: number | null;
        takeProfit?: number | null;
        createdAt?: Date;
        updatedAt?: Date;
        executedAt?: Date | null;
    }) {
        this._id = props.id ?? null;
        this._userId = props.userId;
        this._symbol = props.symbol;
        this._side = props.side;
        this._orderType = props.orderType;
        this._quantity = props.quantity;
        this._price = props.price;
        this._stopLoss = props.stopLoss ?? null;
        this._takeProfit = props.takeProfit ?? null;
        this._isAlgoTrade = props.isAlgoTrade,
            this._status = props.status;
        this._filledQty = props.filledQty ?? 0;
        this._executedPrice = props.executedPrice ?? null;

        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? new Date();
        this._executedAt = props.executedAt ?? null;
    }

    static create(data: {
        userId: string;
        symbol: string;
        side: OrderSide;
        orderType: OrderType;
        status: OrderStatus;
        quantity: number;
        price: number;
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

    // Getters
    get id() { return this._id; }
    get userId() { return this._userId; }
    get symbol() { return this._symbol; }
    get side() { return this._side; }
    get orderType() { return this._orderType; }
    get quantity() { return this._quantity; }
    get price() { return this._price; }
    get stopLoss() { return this._stopLoss; }
    get takeProfit() { return this._takeProfit; }
    get status() { return this._status; }
    get isAlgoTrade() { return this._isAlgoTrade };
    get filledQty() { return this._filledQty; }
    get executedPrice() { return this._executedPrice; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get executedAt() { return this._executedAt; }

    markFilled() {
        this._status = OrderStatus.FILLED;
        this._filledQty = this._quantity;
        // this._executedPrice = executedPrice;
        this._executedAt = new Date();
        this._updatedAt = new Date();
    }

    markCancelled() {
        this._status = OrderStatus.CANCELLED;
        this._updatedAt = new Date();
    }

    cancel() {
        this._status = OrderStatus.CANCELLED;
        this._updatedAt = new Date();
    }

    updateFilledQty(qty: number, price: number) {
        this._filledQty = qty;
        this._executedPrice = price;

        if (qty >= this._quantity) {
            this._status = OrderStatus.FILLED;
            this._executedAt = new Date();
        }

        this._updatedAt = new Date();
    }

    // Convert → persistence
    toPersistence() {
        return {
            id: this._id,
            userId: this._userId,
            symbol: this._symbol,
            side: this._side,
            orderType: this._orderType,
            quantity: this._quantity,
            price: this._price,
            stopLoss: this._stopLoss,
            takeProfit: this._takeProfit,
            status: this._status,
            filledQty: this._filledQty,
            executedPrice: this._executedPrice,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            executedAt: this._executedAt,
        };
    }
}