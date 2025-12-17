import { BlockHash } from "@domain/value-objects/wallet/block-hash.vo";

export class BlockEntity {
    private readonly _id?: string;
    private readonly _index: number;
    private readonly _prevHash: string;
    private readonly _txHash: string;
    private readonly _blockHash: string;
    private readonly _timestamp: number;

    private constructor(props: {
        id?: string;
        index: number;
        prevHash: string;
        txHash: string;
        blockHash: string;
        timestamp: number;
    }) {
        this._id = props.id;
        this._index = props.index;
        this._prevHash = props.prevHash;
        this._txHash = props.txHash;
        this._blockHash = props.blockHash;
        this._timestamp = props.timestamp;
    }

    static create(data: {
        index: number;
        prevHash: string;
        txHash: string;
    }): BlockEntity {

        const timestamp = Date.now();

        const blockHash = BlockHash.create({
            index: data.index,
            prevHash: data.prevHash,
            txHash: data.txHash,
            timestamp,
        }).value;

        return new BlockEntity({
            index: data.index,
            prevHash: data.prevHash,
            txHash: data.txHash,
            blockHash,
            timestamp,
        });
    }
    
    static fromPersistence(data: {
        id: string;
        index: number;
        prevHash: string;
        txHash: string;
        blockHash: string;
        timestamp: number;
    }): BlockEntity {
        return new BlockEntity({
            id: data.id,
            index: data.index,
            prevHash: data.prevHash,
            txHash: data.txHash,
            blockHash: data.blockHash,
            timestamp: data.timestamp,
        });
    }
    get id() { return this._id; }
    get index() { return this._index; }
    get prevHash() { return this._prevHash; }
    get txHash() { return this._txHash; }
    get blockHash() { return this._blockHash; }
    get timestamp() { return this._timestamp; }
}
