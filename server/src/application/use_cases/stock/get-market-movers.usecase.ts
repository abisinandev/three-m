import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { AsyncHelper } from "@shared/utils/stocks/concurrency.helper";
import { StockMapper } from "@application/mappers/stock/stock.mapper";
import { IGetMarketMoversUseCase, IMarketMoversResponse } from "./interfaces/get-market-movers.interface";

@injectable()
export class GetMarketMoversUseCase implements IGetMarketMoversUseCase {
    constructor(
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(): Promise<IMarketMoversResponse> {

        const result = await this._stockRepository.findAllStocks({
            page: 1,
            limit: 40,
            isVisible: true
        });

        const stockDTOs = StockMapper.toDTOList(result.data);

        const enrichedStocks = await AsyncHelper.mapWithConcurrency(
            stockDTOs,
            10,
            async (stock) => {
                const quote = await this._marketDataProvider.getLatestQuote(stock.symbol);
                return {
                    ...stock,
                    price: quote?.price ?? 0,
                    change: quote?.change ?? 0,
                    changePercent: quote?.changePercent ?? 0,
                }
            }
        );

        const sorted = [...enrichedStocks].sort((a, b) => b.changePercent - a.changePercent);

        const gainers = sorted.filter(s => s.changePercent > 0).slice(0, 5);
        
        const losers = [...sorted].reverse().filter(s => s.changePercent < 0).slice(0, 5);

        return {
            gainers,
            losers
        };
    }
}
