import { StockEntity } from "@domain/entities/stock/stock.entity";
import { QueryOptions } from "mongoose";

export interface IAdminStocksUseCase {
    execute(query: QueryOptions): Promise<{ data: StockEntity[], total: number }>;
}
