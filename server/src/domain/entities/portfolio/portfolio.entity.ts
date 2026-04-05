export class PortfolioEntity {
    private readonly _id?: string | null;
    private readonly _userId: string;
    private readonly _symbol: string;
    private _quantity: number;
    private _avgPrice: number;
    private _investedAmount: number;
    private _lockQty: number;
    private readonly _createdAt: Date;
    private _updatedAt?: Date;

    private constructor(props: {
        id?: string | null;
        userId: string;
        symbol: string;
        quantity: number;
        avgPrice: number;
        investedAmount: number;
        lockQty?: number;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id ?? null;
        this._userId = props.userId;
        this._symbol = props.symbol;
        this._quantity = props.quantity;
        this._avgPrice = props.avgPrice;
        this._investedAmount = props.investedAmount;
        this._lockQty = props.lockQty ?? 0;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt;
    }

    static create(data: {
        userId: string;
        symbol: string;
        quantity: number;
        avgPrice: number;
        investedAmount: number;
    }): PortfolioEntity {
        return new PortfolioEntity({
            userId: data.userId,
            symbol: data.symbol,
            quantity: data.quantity,
            avgPrice: data.avgPrice,
            investedAmount: data.investedAmount,
            lockQty: 0,
        });
    }

    static fromPersistence(data: {
        id: string;
        userId: string;
        symbol: string;
        quantity: number;
        avgPrice: number;
        investedAmount: number;
        lockQty: number;
        createdAt: Date;
        updatedAt?: Date;
    }): PortfolioEntity {
        return new PortfolioEntity({
            id: data.id,
            userId: data.userId,
            symbol: data.symbol,
            quantity: data.quantity,
            avgPrice: data.avgPrice,
            investedAmount: data.investedAmount,
            lockQty: data.lockQty,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    get id(): string | null | undefined {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get symbol(): string {
        return this._symbol;
    }

    get quantity(): number {
        return this._quantity;
    }

    get avgPrice(): number {
        return this._avgPrice;
    }

    get investedAmount(): number {
        return this._investedAmount;
    }

    get lockQty(): number {
        return this._lockQty;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    lockQuantity(qty: number) {
        if (this._quantity - this._lockQty < qty) {
            throw new Error("Insufficient unlocked quantity");
        }
        this._lockQty += qty;
        this._updatedAt = new Date();
    }

    unlockQuantity(qty: number) {
        if (this._lockQty < qty) {
            throw new Error("Cannot unlock more than locked quantity");
        }
        this._lockQty -= qty;
        this._updatedAt = new Date();
    }

    updateQuantityAndPrice(quantity: number, avgPrice: number, investedAmount: number) {
        this._quantity = quantity;
        this._avgPrice = avgPrice;
        this._investedAmount = investedAmount;
        this._updatedAt = new Date();
    }

    toPersistence() {
        return {
            id: this._id,
            userId: this._userId,
            symbol: this._symbol,
            quantity: this._quantity,
            avgPrice: this._avgPrice,
            investedAmount: this._investedAmount,
            lockQty: this._lockQty,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
