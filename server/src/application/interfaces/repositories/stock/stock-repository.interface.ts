import { StockEntity } from "@domain/entities/stock/stock.entity";
import { StockQueryOptions } from "@application/dto/stocks/stock.dto";
import { IBaseRepository } from "../base-repository.interface";

export interface IStockRepository extends IBaseRepository<StockEntity> {
    saveMany(stocks: StockEntity[]): Promise<void>;
    findBySymbol(symbol: string): Promise<StockEntity | null>;
    findAllStocks(options: StockQueryOptions): Promise<{ data: StockEntity[], total: number }>;
    findWithFiltersAdmin(options: Record<string, unknown>): Promise<{ data: StockEntity[], total: number }>;
    updateStatus(symbol: string, statusUpdate: Partial<{ isTradable: boolean; isTracked: boolean; isVisible: boolean }>): Promise<boolean>;
    findBestStocks(): Promise<StockEntity[] | []>;
}