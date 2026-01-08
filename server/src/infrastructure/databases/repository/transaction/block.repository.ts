import { BlockEntity } from "@domain/entities/transaction/block.entity";
import { BaseRepository } from "../base.repository";
import { BlockDocument, BlockModel } from "@infrastructure/databases/mongo_db/models/schemas/transaction/block.schema";
import { BlockMapper } from "@infrastructure/mappers/transaction/block.mapper";
import { ClientSession } from "mongoose";
import { IBlockRepository } from "@application/interfaces/repositories/feature/block-repository.interface";

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