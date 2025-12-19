import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { TxHash } from "@domain/value-objects/wallet/transaction.vo";

export class TransactionEntity {
    private readonly _id?: string;
    private readonly _userId: string;
    private readonly _amount: number;
    private readonly _currency: string;
    private readonly _type: TransactionTypes;
    private readonly _isVerified: boolean;
    private readonly _txHash: TxHash;
    private readonly _referenceType: ReferenceType;
    private readonly _paymentIntentId: string;
    private readonly _status: TransactionStatus;
    private readonly _fundId?: string;
    private readonly _units?: number;
    private readonly _receipt_url?: string;
    private readonly _createdAt: Date;

    private constructor(props: {
        id?: string;
        userId: string;
        amount: number;
        currency: string;
        type: TransactionTypes;
        isVerified: boolean;
        txHash: TxHash;
        referenceType: ReferenceType;
        paymentIntentId: string;
        status: TransactionStatus;
        fundId?: string;
        units?: number;
        receipt_url?: string;
        createdAt?: Date;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._amount = props.amount;
        this._currency = props.currency;
        this._type = props.type;
        this._isVerified = props.isVerified;
        this._txHash = props.txHash;
        this._referenceType = props.referenceType;
        this._paymentIntentId = props.paymentIntentId;
        this._status = props.status;
        this._fundId = props.fundId;
        this._units = props.units;
        this._receipt_url = props.receipt_url;
        this._createdAt = props.createdAt ?? new Date();
    }

    static create(data: {
        userId: string;
        amount: number;
        currency: string;
        type: TransactionTypes;
        referenceType: ReferenceType;
        paymentIntentId: string;
        status: TransactionStatus;
        fundId?: string;
        units?: number;
        receipt_url?: string;
    }): TransactionEntity {
        if (data.amount <= 0) throw new Error("Transaction amount must be positive");
        if (data.type === TransactionTypes.INVEST && !data.fundId)
            throw new Error("FundId is required for investment transactions");

        return new TransactionEntity({
            userId: data.userId,
            amount: data.amount,
            currency: data.currency,
            type: data.type,
            referenceType: data.referenceType,
            txHash: TxHash.generate({
                amount: data.amount,
                userId: data.userId,
                paymentIntentId: data.paymentIntentId,
                fundId: data.fundId,
                unit: data.units,
            }),
            paymentIntentId: data.paymentIntentId,
            status: data.status,
            fundId: data.fundId,
            units: data.units,
            receipt_url: data.receipt_url,
            isVerified: true,
        });
    }

    static fromPersistence(props: {
        id: string;
        userId: string;
        amount: number;
        currency: string;
        type: TransactionTypes;
        isVerified: boolean;
        txHash: string;
        referenceType: ReferenceType;
        paymentIntentId: string;
        status: TransactionStatus;
        fundId?: string;
        units?: number;
        receipt_url?: string;
        createdAt: Date;
    }): TransactionEntity {
        return new TransactionEntity({
            id: props.id,
            userId: props.userId,
            amount: props.amount,
            currency: props.currency,
            type: props.type,
            isVerified: props.isVerified,
            txHash: TxHash.fromExisting(props.txHash),
            referenceType: props.referenceType,
            paymentIntentId: props.paymentIntentId,
            status: props.status,
            fundId: props.fundId,
            units: props.units,
            receipt_url: props.receipt_url,
            createdAt: props.createdAt,
        });
    }

    get id() { return this._id; }
    get userId() { return this._userId; }
    get amount() { return this._amount; }
    get currency() { return this._currency; }
    get type() { return this._type; }
    get isVerified() { return this._isVerified; }
    get txHash() { return this._txHash.value; }
    get referenceType() { return this._referenceType; }
    get paymentIntentId() { return this._paymentIntentId; }
    get status() { return this._status; }
    get fundId() { return this._fundId; }
    get units() { return this._units; }
    get receipt_url() { return this._receipt_url; }
    get createdAt() { return this._createdAt; }
}
