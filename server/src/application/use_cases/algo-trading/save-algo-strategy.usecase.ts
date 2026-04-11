import { inject, injectable } from "inversify";
import { ISaveAlgoStrategyUseCase, SaveAlgoStrategyDTO } from "./interfaces/save-algo-strategy.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";

@injectable()
export class SaveAlgoStrategyUseCase implements ISaveAlgoStrategyUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly algoStrategyRepository: IAlgoStrategyRepository
    ) { }

    async execute(data: SaveAlgoStrategyDTO): Promise<void> {
        const entity = AlgoStrategyEntity.create({
            userId: data.userId,
            symbol: data.symbol,
            strategyName: data.strategyName,
            config: data.config,
            isActive: true
        });

        await this.algoStrategyRepository.create(entity);
    }
}
