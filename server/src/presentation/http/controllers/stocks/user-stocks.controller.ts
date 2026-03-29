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
        @inject(STOCK_TYPES.FetchStocksUseCase) private fetchStocksUseCase: IFetchStocksUseCase,
        @inject(STOCK_TYPES.StockDetailsUseCase) private stockDetailsUseCase: IStockDetailsUseCase,
        @inject(STOCK_TYPES.FetchStockCandlesUseCase) private fetchStockCandlesUseCase: IFetchStockCandlesUseCase,
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

            const result = await this.fetchStocksUseCase.execute(options);

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.STOCK_FETCHED,
                result,
                HttpStatus.ACCEPTED
            );
        } catch (error) {
            next(error);
        }
    }

    async getStockDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const symbol = String(req.params.symbol);
            const result = await this.stockDetailsUseCase.execute(symbol);

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
            const symbol = String(req.params.symbol);
            const resolution = String(req.query.resolution || '1');
            
            let from = Number(req.query.from);
            let to = Number(req.query.to);

            const now = Math.floor(Date.now() / 1000);
            
            // Handle missing or invalid timestamps
            if (!to || isNaN(to)) to = now;
            if (!from || isNaN(from)) from = to - (24 * 60 * 60);

            // Convert milliseconds to seconds if necessary (Finnhub expects seconds)
            if (from > 10 ** 12) from = Math.floor(from / 1000);
            if (to > 10 ** 12) to = Math.floor(to / 1000);

            // Safety: Ensure 'to' is not in the future and 'from' is before 'to'
            if (to > now) to = now;
            if (from >= to) from = to - 3600; 

            const result = await this.fetchStockCandlesUseCase.execute(symbol, resolution, from, to);

            return ResponseHelper.success(
                res,
                "Stock candles fetched successfully",
                result,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }
}
