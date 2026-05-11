import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { TransactionId } from "@domain/entities/user/wallet-value-objects/transaction_id.vo";

export class TransactionEntity {
    private readonly _id?: string;
    private readonly _userId: string;
    private readonly _userCode?: string;
    private readonly _transactionId: TransactionId;
    private readonly _amount: number;
    private readonly _currency: string;
    private readonly _type: TransactionTypes;
    private readonly _referenceType: TransactionReferenceType;
    private readonly _referenceId?: string;
    private readonly _paymentIntentId?: string;
    private _status: TransactionStatus;
    private readonly _profit?: number;
    private readonly _quantity?: number;
    private readonly _price?: number;
    private readonly _fundId?: string;
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
        referenceType: TransactionReferenceType;
        referenceId?: string;
        paymentIntentId?: string;
        status: TransactionStatus;
        profit?: number;
        quantity?: number;
        price?: number;
        fundId?: string;
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
        this._referenceType = props.referenceType;
        this._referenceId = props.referenceId;
        this._paymentIntentId = props.paymentIntentId;
        this._status = props.status;
        this._profit = props.profit;
        this._quantity = props.quantity;
        this._price = props.price;
        this._fundId = props.fundId;
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
        profit?: number;
        quantity?: number;
        price?: number;
        fundId?: string;
        receipt_url?: string;
    }): TransactionEntity {
        if (data.amount <= 0) throw new Error("Transaction amount must be positive");

        return new TransactionEntity({
            userId: data.userId,
            userCode: data.userCode,
            amount: data.amount,
            currency: data.currency,
            transactionId: TransactionId.create(),
            type: data.type,
            referenceType: data.referenceType,
            referenceId: data.referenceId,
            paymentIntentId: data.paymentIntentId,
            status: data.status,
            profit: data.profit,
            quantity: data.quantity,
            price: data.price,
            fundId: data.fundId,
            receipt_url: data.receipt_url,
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
        referenceType: TransactionReferenceType;
        referenceId?: string;
        paymentIntentId: string;
        status: TransactionStatus;
        profit?: number;
        quantity?: number;
        price?: number;
        fundId?: string;
        receipt_url?: string;
        createdAt: Date;
    }): TransactionEntity {

        return new TransactionEntity({
            id: props.id,
            userId: props.userId,
            userCode: props.userCode,
            transactionId: TransactionId.rebuild(props.transactionId),
            amount: props.amount,
            currency: props.currency,
            type: props.type,
            referenceType: props.referenceType,
            referenceId: props.referenceId,
            paymentIntentId: props.paymentIntentId,
            status: props.status,
            profit: props.profit,
            quantity: props.quantity,
            price: props.price,
            fundId: props.fundId,
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
    get referenceType() { return this._referenceType; };
    get referenceId() { return this._referenceId; }
    get paymentIntentId() { return this._paymentIntentId; };
    get status() { return this._status; };
    get profit() { return this._profit; };
    get quantity() { return this._quantity; };
    get price() { return this._price; };
    get fundId() { return this._fundId; };
    get receipt_url() { return this._receipt_url; };
    get createdAt() { return this._createdAt; };

    markSuccess() {
        this._status = TransactionStatus.SUCCESSFUL;
    }

    markFailed() {
        this._status = TransactionStatus.FAILED;
    }


    markAsRefunded() {
        this._status = TransactionStatus.REFUNDED;
    }
}
