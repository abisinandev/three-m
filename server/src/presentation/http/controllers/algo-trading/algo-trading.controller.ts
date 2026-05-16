import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "@domain/enum/express/status-code";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { GetStrategiesUseCase } from "@application/use_cases/algo-trading/get-strategies.usecase";
import { ISaveAlgoStrategyUseCase } from "@application/use_cases/algo-trading/interfaces/save-algo-strategy.interface";
import { IGetActiveStrategyUseCase } from "@application/use_cases/algo-trading/interfaces/get-active-strategy.interface";
import { ITurnOnAlgoTradingUseCase } from "@application/use_cases/algo-trading/interfaces/turn-on-algo-trading.interface";
import { IConfirmBuySignalUseCase } from "@application/use_cases/algo-trading/interfaces/confirm-buy-signal.interface";
import { IConfirmSellSignalUseCase } from "@application/use_cases/algo-trading/interfaces/confirm-sell-signal.interface";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import AppError from "@presentation/express/utils/error-handling/app.error";

@injectable()
export class AlgoTradingController {
    constructor(
        @inject(STOCK_TYPES.GetStrategiesUseCase) private readonly _getStrategiesUseCase: GetStrategiesUseCase,
        @inject(STOCK_TYPES.SaveAlgoStrategyUseCase) private readonly _saveAlgoStrategyUseCase: ISaveAlgoStrategyUseCase,
        @inject(STOCK_TYPES.GetActiveStrategyUseCase) private readonly _getActiveStrategyUseCase: IGetActiveStrategyUseCase,
        @inject(STOCK_TYPES.TurnOnAlgoTradingUseCase) private readonly _turnAlgoTradingUseCase: ITurnOnAlgoTradingUseCase,
        @inject(STOCK_TYPES.ConfirmBuySignalUseCase) private readonly _confirmBuySignalUseCase: IConfirmBuySignalUseCase,
        @inject(STOCK_TYPES.ConfirmSellSignalUseCase) private readonly _confirmSellSignalUseCase: IConfirmSellSignalUseCase,
    ) { }

    async getStrategies(_req: Request, res: Response, next: NextFunction) {
        try {
            const list = this._getStrategiesUseCase.execute();
            return ResponseHelper.success(res, SuccessMessages.ALGO.STRATEGY_FETCHED, list);
        } catch (error) {
            next(error)
        }
    }

    async getActiveStrategy(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const { symbol } = req.params as { symbol: string };
            const strategy = await this._getActiveStrategyUseCase.execute(userId, symbol);
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
            const result = await this._saveAlgoStrategyUseCase.execute({ userId, symbol, strategyName, config });
            
            if (result?.upgrade) {
                return ResponseHelper.success(
                    res,
                    result.message,
                    null,
                    HttpStatus.PAYMENT_REQUIRED
                )
            }

            return ResponseHelper.success(res, SuccessMessages.ALGO.STRATEGY_SAVED, result, HttpStatus.CREATED);
        } catch (error) {
            next(error);
        }
    }

    async TurnOnStrategy(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const { strategyId } = req.params as { strategyId: string };
            const { isActive } = req.body;
            const result = await this._turnAlgoTradingUseCase.execute(userId, strategyId, isActive);
            
            if (result?.upgrade) {
                return ResponseHelper.success(
                    res,
                    result.message,
                    null,
                    HttpStatus.PAYMENT_REQUIRED
                )
            }

            const message = isActive
                ? SuccessMessages.ALGO.STRATEGY_ACTIVATED
                : SuccessMessages.ALGO.STRATEGY_DEACTIVATED;
            return ResponseHelper.success(res, message, result);
        } catch (error) {
            next(error)
        }
    }

    async confirmSignal(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const { action } = req.body;

            let result = null;
            if (action === "BUY") {
                result = await this._confirmBuySignalUseCase.execute({ ...req.body, userId });
            } else if (action === "SELL") {
                result = await this._confirmSellSignalUseCase.execute({ ...req.body, userId });
            } else {
                throw new AppError("Invalid signal action. Must be BUY or SELL.");
            }

            if (result?.upgrade) {
                return ResponseHelper.success(
                    res,
                    result.message,
                    null,
                    HttpStatus.PAYMENT_REQUIRED
                )
            }

            return ResponseHelper.success(res, SuccessMessages.ALGO.SIGNAL_CONFIRMED, null);
        } catch (error) {
            next(error)
        }
    }
}
