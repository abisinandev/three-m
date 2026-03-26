import { StockEntity } from "@domain/entities/stock/stock.entity";

export interface IAdminStocksUseCase {
    getStocks(filters: any, page: number, limit: number): Promise<{ data: StockEntity[], total: number }>;
    updateStockStatus(symbol: string, statusUpdate: Partial<{ isTradable: boolean; isTracked: boolean; isVisible: boolean }>): Promise<boolean>;
}
