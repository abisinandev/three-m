export class StockEntity {
    private readonly _id?: string | null;
    private readonly _symbol: string;
    private readonly _exchange: string;
    private readonly _name: string;
    private readonly _sector: string;
    private readonly _logo: string | null;
    private _isTradable: boolean;
    private _isVisible: boolean;
    private _isTracked: boolean;
    private readonly _createdAt: Date;


    private constructor(props: {
        id?: string | null;
        name: string;
        symbol: string;
        exchange: string;
        sector: string;
        logo?: string | null;
        isTradable: boolean;
        isVisible: boolean;
        isTracked: boolean;
        createdAt?: Date;
    }) {
        this._id = props.id ?? null;
        this._exchange = props.exchange;
        this._name = props.name;
        this._sector = props.sector;
        this._logo = props.logo ?? null;
        this._symbol = props.symbol;
        this._isTradable = props.isTradable;
        this._isTracked = props.isTracked;
        this._isVisible = props.isVisible;
        this._createdAt = props.createdAt ?? new Date();
    }

    static create(data: {
        name: string,
        symbol: string,
        exchange: string,
        isTradable: boolean,
        isVisible: boolean,
        isTracked: boolean,
        sector: string,
        logo?: string | null,
    }): StockEntity {

        return new StockEntity({
            exchange: data.exchange,
            name: data.name,
            symbol: data.symbol,
            isTradable: data.isTradable,
            isVisible: data.isVisible,
            isTracked: data.isTracked,
            sector: data.sector,
            logo: data.logo,
        })
    }


    static fromPersistence(data: {
        id: string;
        name: string;
        symbol: string;
        exchange: string;
        sector: string;
        logo: string | null;
        isTradable: boolean;
        isVisible: boolean;
        isTracked: boolean;
        createdAt: Date;
    }): StockEntity {
        return new StockEntity({
            id: data.id,
            name: data.name,
            symbol: data.symbol,
            exchange: data.exchange,
            sector: data.sector,
            logo: data.logo,
            isTradable: data.isTradable,
            isVisible: data.isVisible,
            isTracked: data.isTracked,
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

    get logo(): string | null {
        return this._logo;
    }

    get isTradable(): boolean {
        return this._isTradable;
    }

    get isVisible(): boolean {
        return this._isVisible;
    }

    get isTracked(): boolean {
        return this._isTracked;
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
            logo: this._logo,
            isTradable: this._isTradable,
            isVisible: this._isVisible,
            isTracked: this._isTracked,
            createdAt: this._createdAt,
        };
    }
}