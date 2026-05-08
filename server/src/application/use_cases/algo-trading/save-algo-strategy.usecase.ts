import { inject, injectable } from "inversify";
import { AlgoStrategyDTO, ISaveAlgoStrategyUseCase } from "./interfaces/save-algo-strategy.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";
import { SuccessMessages } from "@shared/constants/success.messages";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { Features } from "@domain/entities/subscription/enums/features.enum";

@injectable()
export class SaveAlgoStrategyUseCase implements ISaveAlgoStrategyUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly algoStrategyRepository: IAlgoStrategyRepository,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
    ) { }

    async execute(data: AlgoStrategyDTO): Promise<void> {

        const hasAccess = await this._featureAccess.hasAccess(
            data.userId,
            Features.ALGO_TRADING
        );

        if (!hasAccess) {
            return {
                message: SuccessMessages.SUBSCRIPTION.UPGRADE_PREMIUM,
                upgrade: true
            };
        }

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
