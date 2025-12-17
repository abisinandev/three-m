import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { TxHash } from "@domain/value-objects/wallet/transaction.vo";


export class TransactionEntity {
    private readonly _id?: string;
    private readonly _userId: string;
    private readonly _amount: number;
    private readonly _currency: string;
    private readonly _type: string;
    private readonly _isVerified: boolean;
    private readonly _txHash: TxHash;
    private readonly _referenceType: string;
    private readonly _status: string;
    private readonly _fundId?: string;
    private readonly _units?: number;
    private readonly _receipt_url?: string;
    private readonly _createdAt?: Date | null;

    private constructor(props: {
        id?: string;
        userId: string;
        amount: number;
        currency: string;
        type: string;
        isVerified: boolean;
        txHash: TxHash;
        referenceType: string;
        fundId?: string;
        units?: number;
        status: string;
        receipt_url?: string;
        createdAt?: Date | null;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._amount = props.amount;
        this._currency = props.currency;
        this._type = props.type;
        this._fundId = props.fundId;
        this._units = props.units;
        this._isVerified = props.isVerified;
        this._status = props.status;
        this._txHash = props.txHash;
        this._referenceType = props.referenceType;
        this._createdAt = props.createdAt ?? null;
        this._receipt_url = props.receipt_url;
    }

    static create(data: {
        userId: string;
        amount: number;
        currency: string;
        type: string;
        fundId?: string;
        units?: number;
        referenceType: string;
        status: string;
        receipt_url: string;
    }): TransactionEntity {

        if (data.amount <= 0) {
            throw new Error('Transaction amount must should be positive');
        }

        if (data.type === TransactionTypes.INVEST && !data.fundId) {
            throw new Error("FundId required for investment");
        }

        return new TransactionEntity({
            userId: data.userId,
            amount: data.amount,
            currency: data.currency,
            type: data.type,
            txHash: TxHash.generate({
                amount: data.amount,
                userId: data.userId,
                fundId: data.fundId,
                unit: data.units
            }),
            fundId: data.fundId,
            isVerified: true,
            units: data.units,
            referenceType: data.referenceType,
            status: data.status,
            receipt_url: data.receipt_url,
        })
    }

    static fromPersistence(props: {
        id: string;
        userId: string;
        amount: number;
        currency: string;
        type: string;
        isVerified: boolean;
        txHash: string;
        referencetype: string;
        fundId?: string;
        units?: number;
        status: string;
        createdAt?: Date;
        receipt_url: string;
    }): TransactionEntity {

        return new TransactionEntity({
            id: props.id,
            userId: props.userId,
            amount: props.amount,
            currency: props.currency,
            type: props.type,
            isVerified: props.isVerified,
            txHash: TxHash.fromExisting(props.txHash),
            fundId: props.fundId,
            units: props.units,
            status: props.status,
            referenceType: props.referencetype,
            createdAt: props.createdAt ?? null,
            receipt_url: props.receipt_url,
        });
    }

    get id() { return this._id; };
    get userId() { return this._userId; };
    get amount() { return this._amount; };
    get currency() { return this._currency };
    get type() { return this._type };
    get status() { return this._status };
    get txHash() { return this._txHash.value; };
    get fundId() { return this._fundId };
    get isVerified() { return this._isVerified };
    get units() { return this._units; };
    get createdAt() { return this._createdAt; };
    get referenceType() { return this._referenceType; };
    get receipt_url() { return this._receipt_url; };
}