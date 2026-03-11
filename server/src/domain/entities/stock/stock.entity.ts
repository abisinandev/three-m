import { StocksStatus } from "./stocks.enum";

export class StockEntity {
    private readonly _id?: string | null;
    private readonly _symbol: string;
    private readonly _exchange: string;
    private readonly _name: string;
    private readonly _sector: string;
    private _status: StocksStatus;
    private _isTradable: boolean;
    private readonly _createdAt: Date

    private constructor(props: {
        id?: string | null;
        name: string;
        symbol: string;
        exchange: string;
        sector: string;
        status: StocksStatus;
        isTradable: boolean;
        createdAt?: Date;
    }) {
        this._id = props.id ?? null;
        this._exchange = props.exchange;
        this._name = props.name;
        this._sector = props.sector;
        this._symbol = props.symbol;
        this._status = props.status;
        this._isTradable = props.isTradable;
        this._createdAt = props.createdAt ?? new Date();
    }

    static create(data: {
        name: string,
        symbol: string,
        exchange: string,
        status: StocksStatus,
        isTradable: boolean,
        sector: string,
    }): StockEntity {

        return new StockEntity({
            exchange: data.exchange,
            name: data.name,
            symbol: data.symbol,
            status: data.status,
            isTradable: data.isTradable,
            sector: data.sector
        })
    }


    static fromPersistence(data: {
        id: string;
        name: string;
        symbol: string;
        exchange: string;
        sector: string;
        status: StocksStatus;
        isTradable: boolean;
        createdAt: Date;
    }): StockEntity {
        return new StockEntity({
            id: data.id,
            name: data.name,
            symbol: data.symbol,
            exchange: data.exchange,
            sector: data.sector,
            status: data.status,
            isTradable: data.isTradable,
            createdAt: data.createdAt,
        });
    }

    get id(): string | null | undefined {
        return this._id;
    }

    get symbol(): string {
        return this._symbol;
    }

    get exchange(): string {
        return this._exchange;
    }

    get name(): string {
        return this._name;
    }

    get sector(): string {
        return this._sector;
    }

    get status(): string {
        return this._status;
    }

    get isTradable(): boolean {
        return this._isTradable;
    }

    get createdAt(): Date {
        return this._createdAt;
    }


    // Convert entity → persistence
    toPersistence() {
        return {
            id: this._id,
            symbol: this._symbol,
            exchange: this._exchange,
            name: this._name,
            sector: this._sector,
            createdAt: this._createdAt,
        };
    }
}