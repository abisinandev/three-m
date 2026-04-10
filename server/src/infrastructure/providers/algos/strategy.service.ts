import { IStrategyService } from "@application/interfaces/services/algos/strategy-service.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { inject, injectable } from "inversify";

@injectable()
export class StrategyService implements IStrategyService{
    constructor(
        // @inject(STOCK_TYPES.AlgoStrategyRepository) private
    ) { }
    
    async run(): Promise<void> {
        
    }
}