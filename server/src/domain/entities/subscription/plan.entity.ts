import { Features } from "./enums/features.enum";
import { SubscriptionPlans } from "./enums/plans.enum";

export class PlanEntity {
    private readonly _id?: string;
    private readonly _code: SubscriptionPlans;
    private _price: number;
    private _durationInDays: number;
    private _features: string[];
    private _isActive: boolean;
    private readonly _createdAt: Date;
    private _updatedAt?: Date;

    private constructor(props: {
        id?: string;
        code: SubscriptionPlans;
        price: number;
        durationInDays: number;
        features: string[];
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
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

    update(props: {
        price?: number;
        durationInDays?: number;
        features?: string[];
        isActive?: boolean;
    }) {
        if (this._code === SubscriptionPlans.FREE) {
            throw new Error("Base FREE plan cannot be modified.");
        }

        if (props.price !== undefined) {
            if (props.price < 0) throw new Error("Price cannot be negative.");
            this._price = props.price;
        }

        if (props.durationInDays !== undefined) {
            if (props.durationInDays <= 0) throw new Error("Duration must be greater than zero.");
            this._durationInDays = props.durationInDays;
        }

        if (props.features !== undefined) {

            const validFeatures = this._code === SubscriptionPlans.PREMIUM
                ? (Object.values(Features) as string[])
                : (Object.values(Features) as string[]);

            const filteredFeatures = props.features.filter(f => validFeatures.includes(f));
        
            this._features = Array.from(new Set(filteredFeatures));
        }

        if (props.isActive !== undefined) {
            this._isActive = props.isActive;
        }

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