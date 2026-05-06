import { inject, injectable } from "inversify";
import { ISearchStocksUseCase } from "./interface/search-stocks.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockSearchProvider, ISearchedStock } from "@application/interfaces/repositories/stock/stock-search-provider.interface";

@injectable()
export class SearchStocksUseCase implements ISearchStocksUseCase {
    constructor(
        @inject(STOCK_TYPES.StockSearchProvider) private readonly _stockSearchProvider: IStockSearchProvider,
    ) { }

    async execute(query: string): Promise<ISearchedStock[]> {
        return await this._stockSearchProvider.search(query);
    }
}
