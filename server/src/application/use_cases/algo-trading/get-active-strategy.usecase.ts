import { inject, injectable } from "inversify";
import { IGetActiveStrategyUseCase } from "./interfaces/get-active-strategy.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";

@injectable()
export class GetActiveStrategyUseCase implements IGetActiveStrategyUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly algoStrategyRepository: IAlgoStrategyRepository
    ) {}

    public async execute(userId: string, symbol: string): Promise<AlgoStrategyEntity | null> {
        return await this.algoStrategyRepository.findOne({
            userId,
            symbol,
            isActive: true
        });
    }
}
