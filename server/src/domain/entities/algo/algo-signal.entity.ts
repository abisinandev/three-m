import { SignalAction, SignalStatus } from "./enum/signal-enums";

export class AlgoSignalEntity {
    private readonly _id?: string | null;
    private readonly _userId: string;
    private readonly _algoId: string;
    private readonly _symbol: string;
    private readonly _strategyName: string;
    private readonly _action: SignalAction;
    private readonly _price: number;
    private readonly _reason: string;
    private _status: SignalStatus;
    private readonly _createdAt: Date;
    private readonly _expiresAt: Date;

    private constructor(props: {
        id?: string | null;
        userId: string;
        algoId: string;
        symbol: string;
        strategyName: string;
        action: SignalAction;
        price: number;
        reason: string;
        status: SignalStatus;
        createdAt?: Date;
        expiresAt: Date;
    }) {
        this._id = props.id ?? null;
        this._userId = props.userId;
        this._algoId = props.algoId;
        this._symbol = props.symbol;
        this._strategyName = props.strategyName;
        this._action = props.action;
        this._price = props.price;
        this._reason = props.reason;
        this._status = props.status;
        this._createdAt = props.createdAt ?? new Date();
        this._expiresAt = props.expiresAt;
    }

    static create(data: {
        userId: string;
        algoId: string;
        symbol: string;
        strategyName: string;
        action: SignalAction;
        price: number;
        reason: string;
        expiresAt: Date;
    }): AlgoSignalEntity {
        if (data.price <= 0) {
            throw new Error('Price must be greater than 0');
        }

        return new AlgoSignalEntity({
            userId: data.userId,
            algoId: data.algoId,
            symbol: data.symbol,
            strategyName: data.strategyName,
            action: data.action,
            price: data.price,
            reason: data.reason,
            status: SignalStatus.PENDING,
            expiresAt: data.expiresAt,
        });
    }

    static fromPersistence(data: {
        id: string;
        userId: string;
        algoId: string;
        symbol: string;
        strategyName: string;
        action: SignalAction;
        price: number;
        reason: string;
        status: SignalStatus;
        createdAt: Date;
        expiresAt: Date;
    }): AlgoSignalEntity {
        return new AlgoSignalEntity({
            id: data.id,
            userId: data.userId,
            algoId: data.algoId,
            symbol: data.symbol,
            strategyName: data.strategyName,
            action: data.action,
            price: data.price,
            reason: data.reason,
            status: data.status,
            createdAt: data.createdAt,
            expiresAt: data.expiresAt,
        });
    }

    get id() { return this._id; }
    get userId() { return this._userId; }
    get algoId() { return this._algoId; }
    get symbol() { return this._symbol; }
    get strategyName() { return this._strategyName; }
    get action() { return this._action; }
    get price() { return this._price; }
    get reason() { return this._reason; }
    get status() { return this._status; }
    get createdAt() { return this._createdAt; }
    get expiresAt() { return this._expiresAt; }

    approve() {
        if (this._status !== SignalStatus.PENDING) {
            throw new Error('Only pending signals can be approved');
        }
        this._status = SignalStatus.APPROVED;
    }

    reject() {
        if (this._status !== SignalStatus.PENDING) {
            throw new Error('Only pending signals can be rejected');
        }
        this._status = SignalStatus.REJECTED;
    }

    expire() {
        if (
            this._status === SignalStatus.APPROVED ||
            this._status === SignalStatus.REJECTED
        ) {
            return;
        }
        this._status = SignalStatus.EXPIRED;
    }

    isExpired(): boolean {
        return new Date() > this._expiresAt;
    }

    toPersistence() {
        return {
            id: this._id,
            userId: this._userId,
            algoId: this._algoId,
            symbol: this._symbol,
            action: this._action,
            price: this._price,
            reason: this._reason,
            status: this._status,
            createdAt: this._createdAt,
            expiresAt: this._expiresAt,
        };
    }
}