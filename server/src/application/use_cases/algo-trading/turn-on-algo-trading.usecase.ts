import { inject, injectable } from "inversify";
import { ITurnOnAlgoTradingUseCase } from "./interfaces/turn-on-algo-trading.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { SuccessMessages } from "@shared/constants/success.messages";

@injectable()
export class TurnOnAlgoTradingUseCase implements ITurnOnAlgoTradingUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly _algoStrategyRepository: IAlgoStrategyRepository,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
    ) { }

    async execute(userId: string, strategyId: string, isActive: boolean): Promise<void | { message: string, upgrade: boolean }> {

        const hasAccess = await this._featureAccess.hasAccess(
            userId,
            Features.ALGO_TRADING
        );

        if (!hasAccess) {
            return {
                message: SuccessMessages.SUBSCRIPTION.UPGRADE_PREMIUM,
                upgrade: true
            };
        }

        const strategy = await this._algoStrategyRepository.findById(strategyId);

        if (!strategy) {
            throw new Error("Strategy not found");
        }

        if (strategy.userId !== userId) {
            throw new Error("Unauthorized to modify this strategy");
        }

        strategy.toggleActive(isActive);
        await this._algoStrategyRepository.update(strategyId, { isActive });
    }
}
