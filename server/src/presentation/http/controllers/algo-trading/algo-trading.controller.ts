import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { GetStrategiesUseCase } from "@application/use_cases/algo-trading/get-strategies.usecase";
import { ISaveAlgoStrategyUseCase } from "@application/use_cases/algo-trading/interfaces/save-algo-strategy.interface";
import { IGetActiveStrategyUseCase } from "@application/use_cases/algo-trading/interfaces/get-active-strategy.interface";
import { IToggleAlgoStrategyUseCase } from "@application/use_cases/algo-trading/interfaces/toggle-algo-strategy.interface";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";

@injectable()
export class AlgoTradingController {
    constructor(
        @inject(STOCK_TYPES.GetStrategiesUseCase) private readonly getStrategiesUseCase: GetStrategiesUseCase,
        @inject(STOCK_TYPES.SaveAlgoStrategyUseCase) private readonly saveAlgoStrategyUseCase: ISaveAlgoStrategyUseCase,
        @inject(STOCK_TYPES.GetActiveStrategyUseCase) private readonly getActiveStrategyUseCase: IGetActiveStrategyUseCase,
        @inject(STOCK_TYPES.ToggleAlgoStrategyUseCase) private readonly toggleAlgoStrategyUseCase: IToggleAlgoStrategyUseCase
    ) { }

    async getStrategies(req: Request, res: Response, next: NextFunction) {
        try {
            const list = this.getStrategiesUseCase.execute();
            return ResponseHelper.success(res, SuccessMessages.ALGO.STRATEGY_FETCHED, list);
        } catch (error) {
            next(error)
        }
    }

    async getActiveStrategy(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const { symbol } = req.params as { symbol: string };

            const strategy = await this.getActiveStrategyUseCase.execute(userId, symbol);

            return ResponseHelper.success(res, SuccessMessages.ALGO.ACTIVE_STRATEGY_FETCHED, strategy);
        } catch (error) {
            next(error)
        }
    }

    async saveStrategy(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const { symbol, strategyName, config } = req.body;

            if (!symbol || !strategyName || !config) {
                return ResponseHelper.failure(res, "Missing required fields", 400);
            }

            await this.saveAlgoStrategyUseCase.execute({
                userId,
                symbol,
                strategyName,
                config
            });

            return ResponseHelper.success(res, SuccessMessages.ALGO.STRATEGY_SAVED, null, 201);
        } catch (error) {
            next(error);
        }
    }

    async toggleStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const { strategyId } = req.params as { strategyId: string };
            const { isActive } = req.body;

            await this.toggleAlgoStrategyUseCase.execute(userId, strategyId, isActive);

            const message = isActive
                ? SuccessMessages.ALGO.STRATEGY_ACTIVATED
                : SuccessMessages.ALGO.STRATEGY_DEACTIVATED;

            return ResponseHelper.success(res, message);
        } catch (error) {
            next(error)
        }
    }
}
