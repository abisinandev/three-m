import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import crypto from "node:crypto";

export class TxHash {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    };

    static generate(data: {
        txType: TransactionTypes;
        userId: string;
        amount: number;

        referenceType?: TransactionReferenceType;
        referenceId?: string;

        paymentIntentId?: string;
    }): TxHash {
        /**
         * IMPORTANT:
         * - Only include fields relevant to this txType
         * - Never include undefined fields
         * - Keep key order stable
         */

        const payload: Record<string, unknown> = {
            txType: data.txType,
            userId: data.userId,
            amount: data.amount,
        };

        if (data.referenceType && data.referenceId) {
            payload.referenceType = data.referenceType;
            payload.referenceId = data.referenceId.toString();
        }
        
        if (data.paymentIntentId) {
            payload.paymentIntentId = data.paymentIntentId;
        }
        
        const payloadString = JSON.stringify(payload);
        console.log(payloadString,'txhasssh')

        
        const hash = crypto
            .createHash("sha256")
            .update(payloadString)
            .digest("hex");

        return new TxHash(hash);
    };


    static fromExisting(hash: string): TxHash {
        if (!hash || hash.length !== 64) {
            throw new Error("Invalid transaction hash");
        }
        return new TxHash(hash);
    };

    get value(): string {
        return this._value;
    };
}
