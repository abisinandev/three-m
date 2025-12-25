import { BlockEntity } from "@domain/entities/block.entity";
import { BaseRepository } from "../base.repository";
import { BlockDocument, BlockModel } from "@infrastructure/databases/mongo_db/models/schemas/block.schema";
import { IBlockRepository } from "@application/interfaces/repositories/block-repository.interface";
import { BlockMapper } from "@infrastructure/mappers/block.mapper";
import { ClientSession } from "mongoose";

export class BlockRepository extends BaseRepository<BlockEntity, BlockDocument> implements IBlockRepository {
    constructor() {
        super(BlockModel, BlockMapper);
    }

    async getLastBlock(session: ClientSession): Promise<BlockEntity | null> {
        const query = BlockModel
            .findOne({})
            .sort({ index: -1 });

        if (session) {
            query.session(session);
        }

        const lastBlockDoc = await query.exec();

        if (!lastBlockDoc) return null;
        return BlockMapper.toDomain(lastBlockDoc);
    }
}