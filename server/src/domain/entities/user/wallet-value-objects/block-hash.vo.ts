import crypto from "node:crypto";

export class BlockHash {
    private constructor(private readonly _value: string) { }

    static create(props: {
        index: number,
        prevHash: string,
        txHash: string,
        timestamp: number,
    }): BlockHash {
        const payload = `${props.index}+${props.prevHash}+${props.txHash}+${props.timestamp}`;
        const hash = crypto.createHash('sha256').update(payload).digest('hex');
        return new BlockHash(hash)
    }

    get value(): string {
        return this._value;
    }
}