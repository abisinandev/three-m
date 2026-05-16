import { inject, injectable } from "inversify";
import { IAddToWatchlistUseCase } from "./interfaces/add-to-watchlist-usecase.interface";
import { WatchlistDTO } from "@application/dto/stocks/watchlist.dto";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IWatchlistRepository } from "@application/interfaces/repositories/stock/watchlist-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { SuccessMessages } from "@shared/constants/success.messages";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { WatchlistEntity } from "@domain/entities/stock/watchlist.entity";

@injectable()
export class AddToWatchlistUseCase implements IAddToWatchlistUseCase {
    constructor(
        @inject(STOCK_TYPES.WatchlistRepository) private readonly _watchlistRepository: IWatchlistRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
    ) { }

    async execute(data: WatchlistDTO, userId: string): Promise<undefined | { message: string, upgrade: boolean }> {
 
        const hasAccess = await this._featureAccess.hasAccess(userId, Features.STOCK_TRADING);
        if (!hasAccess) {
            return {
                message: SuccessMessages.SUBSCRIPTION.UPGRADE_PREMIUM,
                upgrade: true
            };
        }

        const stock = await this._stockRepository.findBySymbol(data.symbol);
        if (!stock) throw new NotFoundError(ErrorMessages.STOCKS.NOT_FOUND);

        const existing = await this._watchlistRepository.findByUserIdAndSymbol(userId, data.symbol);
        if (existing) throw new ValidationError("Stock already in watchlist");

        const watchlistEntry = WatchlistEntity.create({
            userId,
            symbol: data.symbol.toUpperCase(),
        });

        await this._watchlistRepository.create(watchlistEntry);
    }
}
