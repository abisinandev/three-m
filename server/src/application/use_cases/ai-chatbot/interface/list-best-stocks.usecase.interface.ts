import { StockDTO } from "@application/dto/stocks/stock.dto";

export interface IListBestStocksUseCase {
    execute(): Promise<StockDTO[]>;
}