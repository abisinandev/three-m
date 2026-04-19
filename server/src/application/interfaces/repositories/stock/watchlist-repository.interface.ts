import { WatchlistEntity } from "@domain/entities/stock/watchlist.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IWatchlistRepository extends IBaseRepository<WatchlistEntity> {
    findAllByUserId(userId: string): Promise<WatchlistEntity[]>;
    findByUserIdAndSymbol(userId: string, symbol: string): Promise<WatchlistEntity | null>;
    removeByUserIdAndSymbol(userId: string, symbol: string): Promise<boolean>;
}
