import { WatchlistDTO } from "@application/dto/stocks/watchlist.dto";

export interface IAddToWatchlistUseCase {
    execute(data: WatchlistDTO, userId: string): Promise<undefined | { message: string, upgrade: boolean }>;
}
