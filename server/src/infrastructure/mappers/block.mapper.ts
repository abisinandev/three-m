import { BlockEntity } from "@domain/entities/block.entity"
import { BlockDocument } from "@infrastructure/databases/mongo_db/models/schemas/block.schema"

export const toDomain = (doc: BlockDocument): BlockEntity => {
    return BlockEntity.fromPersistence({
        id: doc._id.toString(),
        blockId: doc.blockId,
        index: doc.index,
        prevHash: doc.prevHash,
        txHash: doc.txHash,
        blockHash: doc.blockHash,
        timestamp: doc.timestamp,
    });
}

export const toPersistance = (block: BlockEntity): Partial<BlockDocument> => {
    return {
        index: block.index,
        blockId: block.blockId,
        prevHash: block.prevHash as string,
        txHash: block.txHash,
        blockHash: block.blockHash,
        timestamp: block.timestamp,
    };
};


export const BlockMapper = {
    toDomain,
    toPersistance
}