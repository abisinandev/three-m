import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { SignatureKey } from "@domain/entities/user/wallet-value-objects/signature-key.vo";
import { TxHash } from "@domain/entities/user/wallet-value-objects/transaction.vo";
import { TransactionId } from "@domain/entities/user/wallet-value-objects/transaction_id.vo";

export class TransactionEntity {
    private readonly _id?: string;
    private readonly _userId: string;
    private readonly _userCode?: string;
    private readonly _transactionId: TransactionId;
    private readonly _amount: number;
    private readonly _currency: string;
    private readonly _type: TransactionTypes;
    private readonly _isVerified: boolean;
    private readonly _txHash: TxHash;
    private readonly _signature: SignatureKey;
    private readonly _referenceType: TransactionReferenceType;
    private readonly _referenceId?: string;
    private readonly _paymentIntentId?: string;
    private readonly _status: TransactionStatus;
    private readonly _paymentStatus: TransactionStatus;
    private readonly _fundId?: string;
    private readonly _units?: number;
    private readonly _receipt_url?: string;
    private readonly _createdAt: Date;

    private constructor(props: {
        id?: string;
        userId: string;
        userCode?: string;
        transactionId: TransactionId;
        amount: number;
        currency: string;
        type: TransactionTypes;
        isVerified: boolean;
        txHash: TxHash;
        signature: SignatureKey;
        referenceType: TransactionReferenceType;
        referenceId?: string;
        paymentIntentId?: string;
        status: TransactionStatus;
        paymentStatus: TransactionStatus;
        fundId?: string;
        units?: number;
        receipt_url?: string;
        createdAt?: Date;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._userCode = props.userCode;
        this._transactionId = TransactionId.create(props.transactionId.value);
        this._amount = props.amount;
        this._currency = props.currency;
        this._type = props.type;
        this._isVerified = props.isVerified;
        this._txHash = props.txHash;
        this._signature = props.signature;
        this._referenceType = props.referenceType;
        this._referenceId = props.referenceId;
        this._paymentIntentId = props.paymentIntentId;
        this._status = props.status;
        this._paymentStatus = props.paymentStatus;
        this._fundId = props.fundId;
        this._units = props.units;
        this._receipt_url = props.receipt_url;
        this._createdAt = props.createdAt ?? new Date();
    }

    static create(data: {
        userId: string;
        userCode: string;
        amount: number;
        currency: string;
        type: TransactionTypes;
        referenceType: TransactionReferenceType;
        referenceId?: string;
        paymentIntentId?: string;
        status: TransactionStatus;
        paymentStatus: TransactionStatus;
        fundId?: string;
        units?: number;
        receipt_url?: string;
        isVerified?: boolean;
    }): TransactionEntity {
        if (data.amount <= 0) throw new Error("Transaction amount must be positive");
        if (data.type === TransactionTypes.INVESTMENT && !data.fundId)
            throw new Error("FundId is required for investment transactions");

        const txHash = TxHash.generate({
            txType: data.type,
            amount: data.amount,
            userId: data.userId,
            paymentIntentId: data.paymentIntentId,
            referenceType: data.referenceType,
            referenceId: data.referenceId ?? undefined,
        });
        const signature = SignatureKey.generate(txHash.value);

        return new TransactionEntity({
            userId: data.userId,
            userCode: data.userCode,
            amount: data.amount,
            currency: data.currency,
            transactionId: TransactionId.create(),
            type: data.type,
            referenceType: data.referenceType,
            referenceId: data.referenceId,
            txHash,
            signature,
            paymentIntentId: data.paymentIntentId,
            status: data.status,
            paymentStatus: data.paymentStatus,
            fundId: data.fundId,
            units: data.units,
            receipt_url: data.receipt_url,
            isVerified: data.isVerified ? true : false,
        });
    }

    static fromPersistence(props: {
        id: string;
        userId: string;
        userCode: string;
        transactionId: string;
        amount: number;
        currency: string;
        type: TransactionTypes;
        isVerified: boolean;
        txHash: string;
        signature: string;
        referenceType: TransactionReferenceType;
        referenceId?: string;
        paymentIntentId: string;
        status: TransactionStatus;
        paymentStatus: TransactionStatus;
        fundId?: string;
        units?: number;
        receipt_url?: string;
        createdAt: Date;
    }): TransactionEntity {

        const txHash = TxHash.fromExisting(props.txHash);
        const signature = SignatureKey.generate(txHash.value);

        return new TransactionEntity({
            id: props.id,
            userId: props.userId,
            userCode: props.userCode,
            transactionId: TransactionId.rebuild(props.transactionId),
            amount: props.amount,
            currency: props.currency,
            type: props.type,
            isVerified: props.isVerified,
            txHash,
            signature,
            referenceType: props.referenceType,
            referenceId: props.referenceId,
            paymentIntentId: props.paymentIntentId,
            status: props.status,
            paymentStatus: props.paymentStatus,
            fundId: props.fundId,
            units: props.units,
            receipt_url: props.receipt_url,
            createdAt: props.createdAt,
        });
    };


    get id() { return this._id; };
    get userId() { return this._userId; };
    get userCode() { return this._userCode; };
    get transactionId() { return this._transactionId.value; };
    get amount() { return this._amount; };
    get currency() { return this._currency; };
    get type() { return this._type; };
    get isVerified() { return this._isVerified; };
    get txHash() { return this._txHash.value; };
    get signature() { return this._signature.value; };
    get referenceType() { return this._referenceType; };
    get referenceId() { return this._referenceId; }
    get paymentIntentId() { return this._paymentIntentId; };
    get status() { return this._status; };
    get paymentStatus() { return this._paymentStatus; };
    get fundId() { return this._fundId; };
    get units() { return this._units; };
    get receipt_url() { return this._receipt_url; };
    get createdAt() { return this._createdAt; };
}
