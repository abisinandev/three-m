import { inject, injectable } from "inversify";
import { IStockUpdateUseCase } from "./interface/stock-update-usecase.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";

@injectable()
export class StockUpdateUseCase implements IStockUpdateUseCase {
    constructor(
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }
    
    async execute(symbol: string, statusUpdate: Partial<{ isTradable: boolean; isTracked: boolean; isVisible: boolean; }>): Promise<boolean> {
        return await this._stockRepository.updateStatus(symbol, statusUpdate);
    }
}