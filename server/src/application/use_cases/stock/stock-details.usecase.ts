import { IStockDetailsUseCase } from "./interfaces/stock-details-usecase.interface";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { StockDTO } from "@application/dto/stocks/stock.dto";

@injectable()
export class StockDetailsUseCase implements IStockDetailsUseCase {
    constructor(
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(symbol: string): Promise<{ data: StockDTO, latestPrice: number }> {
        const stock = await this._stockRepository.findBySymbol(symbol);

        if (!stock || !stock.isVisible) {
            throw new NotFoundError(ErrorMessages.STOCKS.NOTFOUND);
        }

        this._marketDataProvider.init();
        this._marketDataProvider.subscribe([symbol]);

        const latestPrices = await this._marketDataProvider.getLatestPrices([symbol]);
        const price = latestPrices[symbol] ?? null;

        return {
            data: {
                id: stock.id as string,
                symbol: stock.symbol,
                name: stock.name,
                exchange: stock.exchange,
                logo: stock.logo,
                sector: stock.sector,
                isTradable: stock.isTradable,
                isVisible: stock.isVisible,
                isTracked: stock.isTracked,
            },
            latestPrice: price,
        };
    }
}