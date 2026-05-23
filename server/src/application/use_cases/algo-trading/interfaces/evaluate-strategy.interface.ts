import { SignalAction } from "@domain/entities/algo/enum/signal-enums";

export interface IEvaluateStrategyUseCase {
    execute(strategyId: string): Promise<{
        userId: string,
        symbol: string,
        strategyName: string,
        action: SignalAction,
        price: number,
        reason: string,
    } | null>;
}
