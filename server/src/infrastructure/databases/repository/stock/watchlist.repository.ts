import { IWatchlistRepository } from "@application/interfaces/repositories/stock/watchlist-repository.interface";
import { WatchlistEntity } from "@domain/entities/stock/watchlist.entity";
import { WatchlistDocument, WatchlistModel } from "@infrastructure/databases/mongo_db/models/schemas/stock/watchlist.schema";
import { BaseRepository } from "@infrastructure/databases/repository/base.repository";
import { WatchlistMapper } from "@infrastructure/mappers/stock/watchlist.mapper";
import { injectable } from "inversify";
import { Types } from "mongoose";

@injectable()
export class WatchlistRepository extends BaseRepository<WatchlistEntity, WatchlistDocument> implements IWatchlistRepository {
    constructor() {
        super(WatchlistModel, WatchlistMapper)
    }

    async findAllByUserId(userId: string): Promise<WatchlistEntity[]> {
        const documents = await WatchlistModel.find({ userId: new Types.ObjectId(userId) }).lean();
        return documents.map(doc => this.mapper.toDomain(doc as unknown as WatchlistDocument));
    }

    async findByUserIdAndSymbol(userId: string, symbol: string): Promise<WatchlistEntity | null> {
        const document = await WatchlistModel.findOne({ 
            userId: new Types.ObjectId(userId), 
            symbol: symbol.toUpperCase() 
        }).lean();
        return document ? this.mapper.toDomain(document as unknown as WatchlistDocument) : null;
    }

    async removeByUserIdAndSymbol(userId: string, symbol: string): Promise<boolean> {
        const result = await WatchlistModel.deleteOne({ 
            userId: new Types.ObjectId(userId), 
            symbol: symbol.toUpperCase() 
        });
        return result.deletedCount > 0;
    }
}
