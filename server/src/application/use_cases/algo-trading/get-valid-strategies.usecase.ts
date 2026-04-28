import { inject, injectable } from "inversify";
import { IGetValidStrategiesUseCase } from "./interfaces/get-valid-strategies.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";

@injectable()
export class GetValidStrategiesUseCase implements IGetValidStrategiesUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly _strategyRepository: IAlgoStrategyRepository,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
    ) { }

    async execute(): Promise<AlgoStrategyEntity[]> {
        const activeStrategies = await this._strategyRepository.getAllActive();
        const validStrategies: AlgoStrategyEntity[] = [];

        for (const strategy of activeStrategies) {
            const hasAccess = await this._featureAccess.hasAccess(
                strategy.userId,
                Features.ALGO_TRADING
            );

            if (hasAccess) {
                validStrategies.push(strategy);
            } else {
                console.warn(`[GetValidStrategiesUseCase] User ${strategy.userId} lacks access for strategy ${strategy.id}. Skipping.`);
            }
        }

        return validStrategies;
    }
}
