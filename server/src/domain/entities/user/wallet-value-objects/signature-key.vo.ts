import { env } from "@presentation/express/utils/constants/env.constants";
import crypto from "node:crypto";

export class SignatureKey {
    private _value: string;

    private constructor(value: string) {
        this._value = value
    }

    static generate(txHash:string): SignatureKey {
        const hash = crypto
            .createHmac('sha256', env.TRANSACTION_SIGNATURE as string)
            .update(txHash)
            .digest('hex');

        return new SignatureKey(hash);
    };

    get value(): string {
        return this._value;
    }
}