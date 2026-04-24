import { inject, injectable } from "inversify";
import { IListBestStocksUseCase } from "../interface/list-best-stocks.usecase.interface";
import { StockDTO } from "@application/dto/stocks/stock.dto";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { StockMapper } from "@application/mappers/stock/stock.mapper";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";

@injectable()
export class ListBestStockUseCase implements IListBestStocksUseCase {

    constructor(
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
    ) { }
    
    async execute(): Promise<StockDTO[]> {
        const result = await this._stockRepository.findAllStocks({ 
            isVisible: true,
            page: 1,
            limit: 10
        });

        
        const subset = result.data.slice(0, 5);
        const dtos = StockMapper.toDTOList(subset);

        const data = await Promise.all(dtos.map(async (stock) => {
            const quote = await this._marketDataProvider.getLatestQuote(stock.symbol);
            return {
                ...stock,
                price: quote?.price ?? null
            };
        }));

        return data;
    }
}
