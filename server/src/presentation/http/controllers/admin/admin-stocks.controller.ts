import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { IAdminStocksUseCase } from "@application/use_cases/admin/stocks-management/interface/admin-stocks-usecase.interface";
import { IAdminStockUpdateUseCase } from "@application/use_cases/admin/stocks-management/interface/admin-stock-update-usecase.interface";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";

@injectable()
export class AdminStocksController {
    constructor(
        @inject(ADMIN_TYPES.AdminStocksUseCase) private adminStocksUseCase: IAdminStocksUseCase,
        @inject(ADMIN_TYPES.AdminStockUpdateUseCase) private adminStockUpdateUseCase: IAdminStockUpdateUseCase
    ) { }

    async getStocks(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1, limit = 20, search, exchange, isTradable, isTracked, isVisible } = req.query;

            const queryItems = {
                search: search as string,
                exchange: exchange as string,
                isTradable: isTradable as string,
                isTracked: isTracked as string,
                isVisible: isVisible as string,
                page: Number(page) || 1,
                limit: Number(limit) || 20
            };

            const result = await this.adminStocksUseCase.execute(queryItems);

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.STOCK_FETCHED,
                {
                    data: result.data.map((stock: any) => stock.toPersistence ? stock.toPersistence() : stock),
                    page: Number(page) || 1,
                    limit: Number(limit) || 20,
                    total: result.total,
                    totalPages: Math.ceil(result.total / (Number(limit) || 20))
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
}
