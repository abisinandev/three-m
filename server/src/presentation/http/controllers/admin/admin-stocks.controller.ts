import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { IStockManagementUseCase } from "@application/use_cases/admin/stocks-management/interface/stocks-management-usecase.interface";
import { IStockUpdateUseCase } from "@application/use_cases/admin/stocks-management/interface/stock-update-usecase.interface";
import { ISearchStocksUseCase } from "@application/use_cases/admin/stocks-management/interface/search-stocks.interface";
import { IAddStockUseCase } from "@application/use_cases/admin/stocks-management/interface/add-stock.interface";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import { StockEntity } from "@domain/entities/stock/stock.entity";

@injectable()
export class AdminStocksController {
    constructor(
        @inject(ADMIN_TYPES.StockManagementUseCase) private _stockManagementUseCase: IStockManagementUseCase,
        @inject(ADMIN_TYPES.StockUpdateUseCase) private _stockUpdateUseCase: IStockUpdateUseCase,
        @inject(ADMIN_TYPES.SearchStocksUseCase) private searchStocksUseCase: ISearchStocksUseCase,
        @inject(ADMIN_TYPES.AddStockUseCase) private addStockUseCase: IAddStockUseCase
    ) { }

    async getStocks(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._stockManagementUseCase.execute(req.query);

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

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const symbol = req.params.symbol as string;
            const { isTradable, isTracked, isVisible } = req.body;

            const updated = await this._stockUpdateUseCase.execute(symbol, {
                ...(isTradable !== undefined && { isTradable }),
                ...(isTracked !== undefined && { isTracked }),
                ...(isVisible !== undefined && { isVisible }),
            });

            if (updated) {
                return ResponseHelper.success(
                    res,
                    "Stock status updated successfully",
                    null,
                    HttpStatus.OK
                );
            } else {
                return ResponseHelper.failure(
                    res,
                    "Stock not found or not modified",
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            next(error)
        }
    }

    async searchStocks(req: Request, res: Response, next: NextFunction) {
        try {
            const { q } = req.query;
            if (!q) {
                return ResponseHelper.failure(res, "Add something to search", HttpStatus.BAD_REQUEST);
            }

            const stocks = await this.searchStocksUseCase.execute(q as string);

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                stocks,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }

    async addStock(req: Request, res: Response, next: NextFunction) {
        try {
            const stockData = req.body;
            await this.addStockUseCase.execute(stockData);

            return ResponseHelper.success(
                res,
                "Stock added successfully",
                null,
                HttpStatus.CREATED
            );
        } catch (error) {
            next(error);
        }
    }
}
