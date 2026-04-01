import { inject, injectable } from "inversify";
import { IAdminStocksUseCase } from "./interface/admin-stocks-usecase.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { StockEntity } from "@domain/entities/stock/stock.entity";
import { QueryOptions } from "mongoose";

@injectable()
export class AdminStocksUseCase implements IAdminStocksUseCase {
    constructor(
        @inject(STOCK_TYPES.StockRepository)
        private stockRepository: IStockRepository
    ) { }

    async execute(query: QueryOptions): Promise<{ data: StockEntity[], total: number }> {
        const { page, limit = 10 } = query;

        const skip = (page - 1) * limit;
        return await this.stockRepository.finAllStocks(query);
    }
}
