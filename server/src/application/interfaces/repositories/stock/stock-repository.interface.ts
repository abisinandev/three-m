import { StockEntity } from "@domain/entities/stock/stock.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IStockRepository extends IBaseRepository<StockEntity> {
    saveMany(stocks: StockEntity[]): Promise<void>;
    findBySymbol(symbol: string): Promise<StockEntity | null>;
}