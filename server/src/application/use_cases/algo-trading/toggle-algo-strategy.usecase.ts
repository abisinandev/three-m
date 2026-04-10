import { inject, injectable } from "inversify";
import { IToggleAlgoStrategyUseCase } from "./interfaces/toggle-algo-strategy.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";

@injectable()
export class ToggleAlgoStrategyUseCase implements IToggleAlgoStrategyUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly algoStrategyRepository: IAlgoStrategyRepository
    ) { }

    async execute(userId: string, strategyId: string, isActive: boolean): Promise<void> {
        const strategy = await this.algoStrategyRepository.findById(strategyId);

        if (!strategy) {
            throw new Error("Strategy not found");
        }

        if (strategy.userId !== userId) {
            throw new Error("Unauthorized to modify this strategy");
        }

        strategy.toggleActive(isActive);
        await this.algoStrategyRepository.update(strategyId, { isActive });
    }
}
