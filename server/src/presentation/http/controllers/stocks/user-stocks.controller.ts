import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IFetchStocksUseCase } from "@application/use_cases/stock/interfaces/fetch-stocks.interface";
import { IStockDetailsUseCase } from "@application/use_cases/stock/interfaces/stock-details-usecase.interface";
import { IFetchStockCandlesUseCase } from "@application/use_cases/stock/interfaces/fetch-stock-candles.interface";
import { StockQueryOptions } from "@application/dto/stocks/stock.dto";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";

@injectable()
export class UserStocksController {
    constructor(
        @inject(STOCK_TYPES.FetchStocksUseCase) private _fetchStocksUseCase: IFetchStocksUseCase,
        @inject(STOCK_TYPES.StockDetailsUseCase) private _stockDetailsUseCase: IStockDetailsUseCase,
        @inject(STOCK_TYPES.FetchStockCandlesUseCase) private _fetchStockCandlesUseCase: IFetchStockCandlesUseCase,
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
                "Stock details fetched successfully",
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
                "Stock candles fetched successfully",
                result,
                HttpStatus.OK
            );
        } catch (error) {
            return next(error);
        }
    }
}
