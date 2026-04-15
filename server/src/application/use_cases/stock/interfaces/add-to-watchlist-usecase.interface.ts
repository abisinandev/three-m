import { WatchlistDTO } from "@application/dto/stocks/watchlist.dto";

export interface IAddToWatchlistUseCase {
    execute(data: WatchlistDTO, userId: string): Promise<void | { message: string, upgrade: boolean }>;
}
