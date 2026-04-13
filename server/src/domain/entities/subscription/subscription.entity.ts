import { SubscriptionPlans } from "./enums/plans.enum";
import { SubscriptionStatus } from "./enums/subscription-status.enums";

export class SubscriptionEntity {
    private readonly _id?: string | null;
    private readonly _userId: string;
    private _planCode: SubscriptionPlans;
    private _startDate: Date;
    private _endDate: Date;
    private _status: SubscriptionStatus;
    private readonly _createdAt: Date;
    private _updatedAt?: Date;

    private constructor(props: {
        id?: string | null;
        userId: string;
        planCode: SubscriptionPlans;
        startDate: Date;
        endDate: Date;
        status?: SubscriptionStatus;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id ?? null;
        this._userId = props.userId;
        this._planCode = props.planCode;
        this._startDate = props.startDate;
        this._endDate = props.endDate;
        this._status = props.status ?? SubscriptionStatus.ACTIVE;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt;
    }

    static create(data: {
        userId: string;
        planCode: SubscriptionPlans;
        durationInDays: number;
    }): SubscriptionEntity {
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + data.durationInDays);

        return new SubscriptionEntity({
            userId: data.userId,
            planCode: data.planCode,
            startDate: start,
            endDate: end,
            status: SubscriptionStatus.ACTIVE,
        });
    }

    static fromPersistence(data: {
        id: string;
        userId: string;
        planCode: SubscriptionPlans;
        startDate: Date;
        endDate: Date;
        status: SubscriptionStatus;
        createdAt: Date;
        updatedAt?: Date;
    }): SubscriptionEntity {
        return new SubscriptionEntity({
            id: data.id,
            userId: data.userId,
            planCode: data.planCode,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    get id() {
        return this._id;
    }

    get userId() {
        return this._userId;
    }

    get planCode() {
        return this._planCode;
    }

    get startDate() {
        return this._startDate;
    }

    get endDate() {
        return this._endDate;
    }

    get status() {
        return this._status;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    isActive(): boolean {
        return this._status === SubscriptionStatus.ACTIVE && this._endDate > new Date();
    }

    renew(planCode: SubscriptionPlans, durationInDays: number) {
        const now = new Date();
        this._planCode = planCode;
        if (this.isActive()) {
       
            this._endDate.setDate(this._endDate.getDate() + durationInDays);
        } else {
 
            this._startDate = now;
            this._endDate = new Date(now);
            this._endDate.setDate(now.getDate() + durationInDays);
        }
        this._status = SubscriptionStatus.ACTIVE;
        this._updatedAt = now;
    }

    expire() {
        if (this._status !== SubscriptionStatus.ACTIVE) return;
        this._status = SubscriptionStatus.EXPIRED;
        this._updatedAt = new Date();
    }

    cancel() {
        this._status = SubscriptionStatus.CANCELLED;
        this._updatedAt = new Date();
    }


    validateStatus() {
        if (this._endDate < new Date() && this._status === SubscriptionStatus.ACTIVE) {
            this._status = SubscriptionStatus.EXPIRED;
            this._updatedAt = new Date();
        }
    }

    toPersistence() {
        return {
            id: this._id,
            userId: this._userId,
            planCode: this._planCode,
            startDate: this._startDate,
            endDate: this._endDate,
            status: this._status,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

}