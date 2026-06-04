import { inject, injectable } from "inversify";
import { IStrategiesUseCase } from "./interfaces/get-valid-strategies.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { IStrategyQueue } from "@application/interfaces/services/algo-trading/strategy-queue.interface";

@injectable()
export class StrategiesUseCase implements IStrategiesUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly _strategyRepository: IAlgoStrategyRepository,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
        @inject(STOCK_TYPES.StrategyQueue) private readonly _strategyQueue: IStrategyQueue,
    ) { }

    async execute(): Promise<void> {
        const activeStrategies = await this._strategyRepository.getAllActive();

        for (const strategy of activeStrategies) {
            const hasAccess = await this._featureAccess.hasAccess(
                strategy.userId,
                Features.ALGO_TRADING
            );

            if (hasAccess) {
                await this._strategyQueue.addStrategyJob(strategy.id as string);
            } else {
                // console.warn(`[GetValidStrategiesUseCase] User ${strategy.userId} lacks access for strategy ${strategy.id}. Skipping.`);
            }
        }
    }
}

