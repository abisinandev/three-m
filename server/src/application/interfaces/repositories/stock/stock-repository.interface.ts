import { StockEntity } from "@domain/entities/stock/stock.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IStockRepository extends IBaseRepository<StockEntity> {
    saveMany(stocks: StockEntity[]): Promise<void>;
    findBySymbol(symbol: string): Promise<StockEntity | null>;
    findFilteredPaginated(filters: any, skip: number, limit: number): Promise<{ data: StockEntity[], total: number }>;
    updateStatus(symbol: string, statusUpdate: Partial<{ isTradable: boolean; isTracked: boolean; isVisible: boolean }>): Promise<boolean>;
}