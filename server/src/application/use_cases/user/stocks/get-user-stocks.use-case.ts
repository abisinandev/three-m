import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { injectable, inject } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";

@injectable()
export class GetUserStocksUseCase {
    constructor(
        @inject(STOCK_TYPES.StockRepository) private stockRepository: IStockRepository
    ) {}

    async execute(filters: { search?: string, exchange?: string }, page: number, limit: number) {
        // Force isVisible to be true for user side
        const safeFilters = {
            ...filters,
            isVisible: true
        };

        const skip = (page - 1) * limit;
        return await this.stockRepository.findFilteredPaginated(safeFilters, skip, limit);
    }
}
