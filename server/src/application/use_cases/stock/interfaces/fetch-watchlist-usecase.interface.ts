import { StockDTO } from "@application/dto/stocks/stock.dto";

export interface IFetchWatchlistUseCase {
    execute(userId: string): Promise<StockDTO[]>;
}
