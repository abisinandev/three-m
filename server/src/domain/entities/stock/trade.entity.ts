import { OrderSide } from "./enum/order-side.enum";

export class TradeEntity {
    private readonly _id?: string | null;
    private readonly _orderId: string;
    private readonly _userId: string;
    private readonly _symbol: string;
    private readonly _side: OrderSide;
    private readonly _quantity: number;
    private readonly _price: number;
    private readonly _profit?: number;

    private readonly _createdAt: Date;
    private readonly _updatedAt: Date;

    private constructor(props: {
        id?: string | null;
        orderId: string;
        userId: string;
        symbol: string;
        side: OrderSide;
        quantity: number;
        price: number;
        profit?: number;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id ?? null;
        this._orderId = props.orderId;
        this._userId = props.userId;
        this._symbol = props.symbol;
        this._side = props.side;
        this._quantity = props.quantity;
        this._price = props.price;
        this._profit = props.profit;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? new Date();
    }

    static create(data: {
        orderId: string;
        userId: string;
        symbol: string;
        side: OrderSide;
        quantity: number;
        price: number;
        profit?: number;
    }): TradeEntity {
        return new TradeEntity({
            orderId: data.orderId,
            userId: data.userId,
            symbol: data.symbol,
            side: data.side,
            quantity: data.quantity,
            price: data.price,
            profit: data.profit,
        });
    }

    static fromPersistence(data: {
        id: string;
        orderId: string;
        userId: string;
        symbol: string;
        side: OrderSide;
        quantity: number;
        price: number;
        profit?: number;
        createdAt: Date;
        updatedAt: Date;
    }): TradeEntity {
        return new TradeEntity({
            id: data.id,
            orderId: data.orderId,
            userId: data.userId,
            symbol: data.symbol,
            side: data.side,
            quantity: data.quantity,
            price: data.price,
            profit: data.profit,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    // Getters
    get id() { return this._id; }
    get orderId() { return this._orderId; }
    get userId() { return this._userId; }
    get symbol() { return this._symbol; }
    get side() { return this._side; }
    get quantity() { return this._quantity; }
    get price() { return this._price; }
    get profit() { return this._profit; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }

    toPersistance() {
        return {
            id: this._id,
            orderId: this._orderId,
            userId: this._userId,
            symbol: this._symbol,
            side: this._side,
            quantity: this._quantity,
            price: this._price,
            profit: this._profit,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

    toJSON() {
        return this.toPersistance();
    }
}
