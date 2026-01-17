import crypto from "node:crypto";

export class TxHash {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    };

    static generate(data: {
        userId: string;
        amount: number;
        paymentIntentId?: string;
        fundId?: string;
        units?: number;
    }): TxHash {
        const payload = JSON.stringify({
            userId: data.userId,
            amount: data.amount,
            fundId: data.fundId,
            unit: data.units,
            paymentIntentId: data.paymentIntentId,
        });

        const hash = crypto
            .createHash('sha256')
            .update(payload)
            .digest('hex');

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
