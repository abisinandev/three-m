import { Cagr } from "@domain/entities/mutual-fund/value-objects/cagr-calculation.vo";

export class MfCagrEntity {
    private readonly _id?: string;
    private readonly _schemeCode: string;
    private readonly _cagr1Y?: Cagr;
    private readonly _cagr3Y?: Cagr;
    private readonly _cagr5Y?: Cagr;
    private readonly _updatedAt: Date;

    private constructor(props: {
        id?: string;
        schemeCode: string;
        cagr1Y?: Cagr;
        cagr3Y?: Cagr;
        cagr5Y?: Cagr;
        updatedAt: Date;
    }) {
        this._id = props.id;
        this._schemeCode = props.schemeCode;
        this._cagr1Y = props.cagr1Y;
        this._cagr3Y = props.cagr3Y;
        this._cagr5Y = props.cagr5Y;
        this._updatedAt = props.updatedAt;
    }

    static create(props: {
        schemeCode: string;
        cagr1Y?: Cagr;
        cagr3Y?: Cagr;
        cagr5Y?: Cagr;
    }): MfCagrEntity {
        return new MfCagrEntity({
            ...props,
            updatedAt: new Date(),
        });
    }

    static fromPersistance(props: {
        id: string;
        schemeCode: string;
        cagr1Y?: number;
        cagr3Y?: number;
        cagr5Y?: number;
        updatedAt: Date;
    }): MfCagrEntity {
        return new MfCagrEntity({
            id: props.id as string,
            schemeCode: props.schemeCode,
            cagr1Y: props.cagr1Y !== undefined ? Cagr.fromPercentage(props.cagr1Y) : undefined,
            cagr3Y: props.cagr3Y !== undefined ? Cagr.fromPercentage(props.cagr3Y) : undefined,
            cagr5Y: props.cagr5Y !== undefined ? Cagr.fromPercentage(props.cagr5Y) : undefined,
            updatedAt: props.updatedAt,
        });
    }

    get id(): string | undefined{
        return this._id;
    }
    get schemeCode(): string {
        return this._schemeCode;
    }

    get cagr1Y(): number | undefined {
        return this._cagr1Y?.value;
    }

    get cagr3Y(): number | undefined {
        return this._cagr3Y?.value;
    }

    get cagr5Y(): number | undefined {
        return this._cagr5Y?.value;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }
}
