import { ValueObjectBase } from "../vo.base-class";

interface ITransactionId {
    value: string;
}

export class TransactionId extends ValueObjectBase<ITransactionId> {
    private constructor(props: ITransactionId) {
        super(props);
    }

    static create(prefix = "TRX"): TransactionId {
        const randomNumber = TransactionId.generateNumbers(3);

        const code = `${prefix}${randomNumber}`;
        return new TransactionId({ value: code });
    }

    static rebuild(value: string): TransactionId {
        return new TransactionId({ value });
    }

    static fromExisting(value: string): TransactionId {
        if (!/^[A-Z]{3,5}[A-Z]{1}\d{3}$/.test(value)) {
            throw new Error("Invalid user code format");
        }
        return new TransactionId({ value });
    }

    private static generateNumbers(length: number): string {
        const digits = Math.floor(Math.random() * 5 ** length)
            .toString()
            .padStart(length, "0");
        return digits;
    }

    get value(): string {
        return this.props.value
    }
}