import { inject, injectable } from "inversify";
import { IAdminStocksUseCase } from "../interfaces/admin-stocks-usecase.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { StockEntity } from "@domain/entities/stock/stock.entity";

@injectable()
export class AdminStocksUseCase implements IAdminStocksUseCase {
    constructor(
        @inject(STOCK_TYPES.StockRepository)
        private stockRepository: IStockRepository
    ) {}

    async getStocks(filters: any, page: number, limit: number): Promise<{ data: StockEntity[], total: number }> {
        const skip = (page - 1) * limit;
        return await this.stockRepository.findFilteredPaginated(filters, skip, limit);
    }

    async updateStockStatus(symbol: string, statusUpdate: Partial<{ isTradable: boolean; isTracked: boolean; isVisible: boolean }>): Promise<boolean> {
        return await this.stockRepository.updateStatus(symbol, statusUpdate);
    }
}
