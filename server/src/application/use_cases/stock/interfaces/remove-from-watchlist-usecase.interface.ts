import { WatchlistDTO } from "@application/dto/stocks/watchlist.dto";

export interface IRemoveFromWatchlistUseCase {
    execute(data: WatchlistDTO, userId: string): Promise<void>;
}
