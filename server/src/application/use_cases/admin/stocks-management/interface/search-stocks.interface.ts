import { ISearchedStock } from "../../../interfaces/repositories/stock/stock-search-provider.interface";

export interface ISearchStocksUseCase {
    execute(query: string): Promise<ISearchedStock[]>;
}
