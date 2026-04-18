import { IAdminGetStrategiesUseCase } from "@application/use_cases/admin/algo-trading/interfaces/admin-get-strategies-usecase.interface";
import { IAdminGetSignalUseCase } from "@application/use_cases/admin/algo-trading/interfaces/admin-get-signals-usecase.interface";
import { IAdminAlgoTradingUseCase } from "@application/use_cases/admin/algo-trading/interfaces/admin-algo-trading-usecaes.interface";
import { IAdminGetAlgoTradesUseCase } from "@application/use_cases/admin/algo-trading/interfaces/admin-get-algo-trades-usecase.interface";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ALGO_TRADING_TYPES } from "@infrastructure/inversify_di/features/algo-trading/algo-trading.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminAlgoTradingController {
    constructor(
        @inject(ALGO_TRADING_TYPES.AdminAlgoTradingUseCase) private readonly _getStats: IAdminAlgoTradingUseCase,
        @inject(ALGO_TRADING_TYPES.AdminGetStrategiesUseCase) private readonly _getStrategies: IAdminGetStrategiesUseCase,
        @inject(ALGO_TRADING_TYPES.AdminGetSignalUseCase) private readonly _getSignals: IAdminGetSignalUseCase,
        @inject(ALGO_TRADING_TYPES.AdminGetAlgoTradesUseCase) private readonly _getAlgoTrades: IAdminGetAlgoTradesUseCase,
    ) { }

    async getAlgoTrading(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._getStats.execute();
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }

    async getStrategies(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const search = (req.query.search as string) || "";
            const sortBy = (req.query.sortBy as string) || "createdAt";
            const sortOrder = (req.query.sortOrder as string) || "desc";

            const result = await this._getStrategies.execute({ page, limit, search, sortBy, sortOrder });
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }

    async getSignals(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const search = (req.query.search as string) || "";
            const sortBy = (req.query.sortBy as string) || "createdAt";
            const sortOrder = (req.query.sortOrder as string) || "desc";

            const result = await this._getSignals.execute({ page, limit, search, sortBy, sortOrder });
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK
            ); 
        } catch (error) {
            next(error);
        }
    }

    async getAlgoTrades(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const search = (req.query.search as string) || "";
            const sortBy = (req.query.sortBy as string) || "createdAt";
            const sortOrder = (req.query.sortOrder as string) || "desc";

            const result = await this._getAlgoTrades.execute({ page, limit, search, sortBy, sortOrder });
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }
}