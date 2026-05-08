import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { IAdminStocksUseCase } from "@application/use_cases/admin/stocks-management/interface/admin-stocks-usecase.interface";
import { IAdminStockUpdateUseCase } from "@application/use_cases/admin/stocks-management/interface/admin-stock-update-usecase.interface";
import { ISearchStocksUseCase } from "@application/use_cases/admin/stocks-management/interface/search-stocks.interface";
import { IAddStockUseCase } from "@application/use_cases/admin/stocks-management/interface/add-stock.interface";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import { StockEntity } from "@domain/entities/stock/stock.entity";

@injectable()
export class AdminStocksController {
    constructor(
        @inject(ADMIN_TYPES.AdminStocksUseCase) private adminStocksUseCase: IAdminStocksUseCase,
        @inject(ADMIN_TYPES.AdminStockUpdateUseCase) private adminStockUpdateUseCase: IAdminStockUpdateUseCase,
        @inject(ADMIN_TYPES.SearchStocksUseCase) private searchStocksUseCase: ISearchStocksUseCase,
        @inject(ADMIN_TYPES.AddStockUseCase) private addStockUseCase: IAddStockUseCase
    ) { }

    async getStocks(req: Request, res: Response, next: NextFunction) {
        try {
            const { 
                page = 1, 
                limit = 20, 
                search = "", 
                sortBy = "symbol", 
                sortOrder = "asc",
                exchange, 
                isTradable, 
                isTracked, 
                isVisible 
            } = req.query;

            const filter: Record<string, unknown> = {};
            if (exchange) filter.exchange = exchange;
            if (isTradable !== undefined && isTradable !== "") filter.isTradable = isTradable === 'true';
            if (isTracked !== undefined && isTracked !== "") filter.isTracked = isTracked === 'true';
            if (isVisible !== undefined && isVisible !== "") filter.isVisible = isVisible === 'true';

            const result = await this.adminStocksUseCase.execute({
                page: Number(page),
                limit: Number(limit),
                search: search as string,
                sortBy: sortBy as string,
                sortOrder: sortOrder as string,
                filter
            });

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.STOCK_FETCHED,
                {
                    data: result.data.map((stock: StockEntity) => stock.toPersistence ? stock.toPersistence() : stock),
                    page: Number(page),
                    limit: Number(limit),
                    total: result.total,
                    totalPages: Math.ceil(result.total / Number(limit))
                },
                HttpStatus.OK
            );
        } catch (error) {
            next(error)
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const symbol = req.params.symbol as string;
            const { isTradable, isTracked, isVisible } = req.body;

            const updated = await this.adminStockUpdateUseCase.execute(symbol, {
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
                return ResponseHelper.failure(res, "Search query is required", HttpStatus.BAD_REQUEST);
            }

            const stocks = await this.searchStocksUseCase.execute(q as string);

            return ResponseHelper.success(
                res,
                "Stocks searched successfully",
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
