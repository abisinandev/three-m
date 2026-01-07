import { InvestmentStatus, InvestmentType } from "@domain/enum/funds/investment.enums";

export class InvestmentEntity {
    private readonly _id?: string;
    private readonly _userId: string;
    private readonly _schemeCode: string;

    private readonly _type: InvestmentType;
    private readonly _amount: number;
    private readonly _units: number;

    private readonly _nav: number;
    private readonly _navDate: Date;

    private readonly _status: InvestmentStatus;

    private readonly _createdAt?: Date;
    private readonly _updatedAt?: Date;

    private constructor(props: {
        id?: string;
        userId: string;
        schemeCode: string;

        type: InvestmentType;
        amount: number;
        units: number;

        nav: number;
        navDate: Date;

        status: InvestmentStatus;

        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._schemeCode = props.schemeCode;

        this._type = props.type;
        this._amount = props.amount;
        this._units = props.units;

        this._nav = props.nav;
        this._navDate = props.navDate;

        this._status = props.status;

        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(data: {
        userId: string;
        schemeCode: string;

        type: InvestmentType;
        amount: number;
        units: number;

        nav: number;
        navDate: Date;
    }): InvestmentEntity {
        return new InvestmentEntity({
            userId: data.userId,
            schemeCode: data.schemeCode,

            type: data.type,
            amount: data.amount,
            units: data.units,

            nav: data.nav,
            navDate: data.navDate,

            status: InvestmentStatus.PENDING,
        });
    }

    static fromPersistance(props: {
        id: string;
        userId: string;
        schemeCode: string;

        type: InvestmentType;
        amount: number;
        units: number;

        nav: number;
        navDate: Date;

        status: InvestmentStatus;

        createdAt: Date;
        updatedAt: Date;
    }): InvestmentEntity {
        return new InvestmentEntity({
            id: props.id,
            userId: props.userId,
            schemeCode: props.schemeCode,

            type: props.type,
            amount: props.amount,
            units: props.units,

            nav: props.nav,
            navDate: props.navDate,

            status: props.status,

            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
    }


    get id(): string | undefined {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get schemeCode(): string {
        return this._schemeCode;
    }

    get type(): InvestmentType {
        return this._type;
    }

    get amount(): number {
        return this._amount;
    }

    get units(): number {
        return this._units;
    }

    get nav(): number {
        return this._nav;
    }

    get navDate(): Date {
        return this._navDate;
    }

    get status(): InvestmentStatus {
        return this._status;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }
}