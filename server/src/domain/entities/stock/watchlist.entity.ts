export class WatchlistEntity {
    private readonly _id?: string | null;
    private readonly _userId: string;
    private readonly _symbol: string;
    private readonly _createdAt: Date;

    private constructor(props: {
        id?: string | null;
        userId: string;
        symbol: string;
        createdAt?: Date;
    }) {
        this._id = props.id ?? null;
        this._userId = props.userId;
        this._symbol = props.symbol;
        this._createdAt = props.createdAt ?? new Date();
    }

    static create(data: {
        userId: string;
        symbol: string;
    }): WatchlistEntity {
        return new WatchlistEntity({
            userId: data.userId,
            symbol: data.symbol,
        });
    }


    static fromPersistence(data: {
        id: string;
        userId: string;
        symbol: string;
        createdAt: Date;
    }): WatchlistEntity {
        return new WatchlistEntity({
            id: data.id,
            userId: data.userId,
            symbol: data.symbol,
            createdAt: data.createdAt,
        });
    }

    // Getters
    get id(): string | null | undefined {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get symbol(): string {
        return this._symbol;
    }

    get createdAt(): Date {
        return this._createdAt;
    }


    // Convert entity → persistence
    toPersistence() {
        return {
            id: this._id,
            userId: this._userId,
            symbol: this._symbol,
            createdAt: this._createdAt,
        };
    }
}
