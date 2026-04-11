import { SubscriptionPlans } from "./enums/plans.enum";

export class PlanEntity {
    private readonly _id?: string | null;
    private readonly _code: SubscriptionPlans;
    private _price: number;
    private _durationInDays: number;
    private _features: string[];
    private _isActive: boolean;
    private readonly _createdAt: Date;
    private _updatedAt?: Date;

    private constructor(props: {
        id?: string | null;
        code: SubscriptionPlans;
        price: number;
        durationInDays: number;
        features: string[];
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id ?? null;
        this._code = props.code;
        this._price = props.price;
        this._durationInDays = props.durationInDays;
        this._features = props.features;
        this._isActive = props.isActive ?? true;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt;
    }

    static create(data: {
        code: SubscriptionPlans;
        price: number;
        durationInDays: number;
        features: string[];
    }): PlanEntity {
        return new PlanEntity({
            code: data.code,
            price: data.price,
            durationInDays: data.durationInDays,
            features: data.features,
            isActive: true,
        });
    }

    static fromPersistence(data: {
        id: string;
        code: SubscriptionPlans;
        price: number;
        durationInDays: number;
        features: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt?: Date;
    }): PlanEntity {
        return new PlanEntity({
            id: data.id,
            code: data.code,
            price: data.price,
            durationInDays: data.durationInDays,
            features: data.features,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    get id() {
        return this._id;
    }

    get code() {
        return this._code;
    }

    get price() {
        return this._price;
    }

    get durationInDays() {
        return this._durationInDays;
    }

    get features() {
        return this._features;
    }

    get isActive() {
        return this._isActive;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    updatePrice(price: number) {
        if (price < 0) throw new Error("Invalid price");
        this._price = price;
        this._updatedAt = new Date();
    }

    updateDuration(days: number) {
        if (days <= 0) throw new Error("Invalid duration");
        this._durationInDays = days;
        this._updatedAt = new Date();
    }

    hasFeature(feature: string): boolean {
        return this._features.includes(feature);
    }

    activate() {
        this._isActive = true;
        this._updatedAt = new Date();
    }

    deactivate() {
        this._isActive = false;
        this._updatedAt = new Date();
    }

    toPersistence() {
        return {
            id: this._id,
            code: this._code,
            price: this._price,
            durationInDays: this._durationInDays,
            features: this._features,
            isActive: this._isActive,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}