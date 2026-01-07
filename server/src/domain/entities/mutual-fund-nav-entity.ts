export class MutualFundNavEntity {
    private readonly _id?: string;
    private readonly _schemeCode: string;
    private readonly _nav: number;
    private readonly _navDate: Date;
    private readonly _source: string;
    private readonly _createdAt?: Date;
    private readonly _updatedAt?: Date;

    private constructor(props: {
        id?: string;
        schemeCode: string;
        nav: number;
        navDate: Date;
        source: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
        this._schemeCode = props.schemeCode;
        this._nav = props.nav;
        this._navDate = props.navDate;
        this._source = props.source;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(data: {
        schemeCode: string;
        nav: number;
        navDate: Date;
        source: string;
    }): MutualFundNavEntity {
        return new MutualFundNavEntity({
            schemeCode: data.schemeCode,
            nav: data.nav,
            source: data.source,
            navDate: data.navDate,
        });
    }

    static fromPersistance(props: {
        id: string;
        schemeCode: string;
        nav: number;
        navDate: Date;
        source: string;
        createdAt: Date;
        updatedAt: Date;
    }): MutualFundNavEntity {
        return new MutualFundNavEntity({
            id: props.id,
            schemeCode: props.schemeCode,
            nav: props.nav,
            navDate: props.navDate,
            source: props.source,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        })
    }

    get id(): string | undefined {
        return this._id;
    }

    get schemeCode(): string {
        return this._schemeCode;
    }

    get nav(): number {
        return this._nav;
    }

    get navDate(): Date {
        return this._navDate;
    };

    get source(): string{
        return this._source;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

}