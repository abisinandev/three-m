import { inject, injectable } from "inversify";
import { IRemoveFromWatchlistUseCase } from "./interfaces/remove-from-watchlist-usecase.interface";
import { WatchlistDTO } from "@application/dto/stocks/watchlist.dto";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IWatchlistRepository } from "@application/interfaces/repositories/stock/watchlist-repository.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";

@injectable()
export class RemoveFromWatchlistUseCase implements IRemoveFromWatchlistUseCase {
    constructor(
        @inject(STOCK_TYPES.WatchlistRepository) private readonly _watchlistRepository: IWatchlistRepository,
    ) { }

    async execute(data: WatchlistDTO, userId: string): Promise<void> {
        const removed = await this._watchlistRepository.removeByUserIdAndSymbol(userId, data.symbol);
        if (!removed) throw new NotFoundError("Stock not found in watchlist");
    }
}
