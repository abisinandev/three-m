import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IFetchStocksUseCase } from "@application/use_cases/stock/interfaces/fetch-stocks.interface";
import { IStockDetailsUseCase } from "@application/use_cases/stock/interfaces/stock-details-usecase.interface";
import { IFetchStockCandlesUseCase } from "@application/use_cases/stock/interfaces/fetch-stock-candles.interface";
import { IFetchWatchlistUseCase } from "@application/use_cases/stock/interfaces/fetch-watchlist-usecase.interface";
import { IAddToWatchlistUseCase } from "@application/use_cases/stock/interfaces/add-to-watchlist-usecase.interface";
import { IRemoveFromWatchlistUseCase } from "@application/use_cases/stock/interfaces/remove-from-watchlist-usecase.interface";
import { StockQueryOptions } from "@application/dto/stocks/stock.dto";
import { WatchlistDTO } from "@application/dto/stocks/watchlist.dto";
import { IGetMarketMoversUseCase } from "@application/use_cases/stock/interfaces/get-market-movers.interface";

import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";

@injectable()
export class UserStocksController {
    constructor(
        @inject(STOCK_TYPES.FetchStocksUseCase) private _fetchStocksUseCase: IFetchStocksUseCase,
        @inject(STOCK_TYPES.StockDetailsUseCase) private _stockDetailsUseCase: IStockDetailsUseCase,
        @inject(STOCK_TYPES.FetchStockCandlesUseCase) private _fetchStockCandlesUseCase: IFetchStockCandlesUseCase,
        @inject(STOCK_TYPES.FetchWatchlistUseCase) private _fetchWatchlistUseCase: IFetchWatchlistUseCase,
        @inject(STOCK_TYPES.AddToWatchlistUseCase) private _addToWatchlistUseCase: IAddToWatchlistUseCase,
        @inject(STOCK_TYPES.RemoveFromWatchlistUseCase) private _removeFromWatchlistUseCase: IRemoveFromWatchlistUseCase,
        @inject(STOCK_TYPES.GetMarketMoversUseCase) private _getMarketMoversUseCase: IGetMarketMoversUseCase,
    ) { }


    async getStocks(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit, search, exchange } = req.query;

            const options: StockQueryOptions = {
                page: Number(page) || 1,
                limit: Number(limit) || 20,
                search: search as string | undefined,
                exchange: exchange as string | undefined,
            };

            const result = await this._fetchStocksUseCase.execute(options);

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.STOCK_FETCHED,
                result,
                HttpStatus.OK
            );

        } catch (error) {
            next(error);
        }
    }

    async getStockDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const symbol = String(req.params.symbol);
            const result = await this._stockDetailsUseCase.execute(symbol);

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.STOCK_FETCHED,
                result,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }


    async getStockCandles(req: Request, res: Response, next: NextFunction) {
        try {
            const input = {
                symbol: String(req.params.symbol),
                resolution: String(req.query.resolution || '1'),
                from: Number(req.query.from),
                to: Number(req.query.to),
            };

            const result = await this._fetchStockCandlesUseCase.execute(input);

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.STOCK_FETCHED,
                result,
                HttpStatus.OK
            );
        } catch (error) {
            return next(error);
        }
    }

    async getWatchlist(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const result = await this._fetchWatchlistUseCase.execute(userId);

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

    async addToWatchlist(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const data: WatchlistDTO = req.body;

            const result = await this._addToWatchlistUseCase.execute(data, userId);

            if (result && result.upgrade) {
                return ResponseHelper.success(res, result.message, { upgrade: true }, HttpStatus.OK);
            }

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.SAVED,
                null,
                HttpStatus.CREATED
            );
        } catch (error) {
            next(error);
        }
    }

    async removeFromWatchlist(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const data: WatchlistDTO = req.body;

            await this._removeFromWatchlistUseCase.execute(data, userId);

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.DELETED,
                null,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }
    async getMarketMovers(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._getMarketMoversUseCase.execute();

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.STOCK_FETCHED,
                result,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }
}

