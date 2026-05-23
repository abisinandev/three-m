import { ISearchedStock } from "@application/interfaces/repositories/stock/stock-search-provider.interface";

export interface IAddStockUseCase {
    execute(stock: ISearchedStock & { logo?: string | null }): Promise<void>;
}
