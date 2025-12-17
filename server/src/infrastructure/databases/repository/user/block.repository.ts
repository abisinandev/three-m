import { BlockEntity } from "@domain/entities/block.entity";
import { BaseRepository } from "../base.repository";
import { BlockDocument, BlockModel } from "@infrastructure/databases/mongo_db/models/schemas/block.schema";
import { IBlockRepository } from "@application/interfaces/repositories/block-repository.interface";
import { BlockMapper } from "@infrastructure/mappers/block.mapper";

export class BlockRepository extends BaseRepository<BlockEntity, BlockDocument> implements IBlockRepository {
    constructor() {
        super(BlockModel, BlockMapper);
    }

    async getLastBlock(): Promise<BlockEntity | null> {
        const lastBlockDoc = await BlockModel.findOne({}).sort({ index: -1 }).limit(1);
        if (!lastBlockDoc) return null
        return BlockMapper.toDomain(lastBlockDoc);
    }
}