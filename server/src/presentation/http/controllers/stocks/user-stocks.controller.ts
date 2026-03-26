import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IFetchStocks } from "@application/use_cases/stock/interfaces/fetch-stocks.interface";

@injectable()
export class UserStocksController {
    constructor(
        @inject(STOCK_TYPES.FetchStocksUseCase) private fetchStocksUseCase: IFetchStocks
    ) { }

    async getStocks(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1, limit = 20, search, exchange } = req.query;

            const filters = {
                search: search as string,
                exchange: exchange as string
            };

            const result = await this.fetchStocksUseCase.execute(
                filters,
                Number(page) || 1,
                Number(limit) || 20
            );

            res.status(200).json({
                success: true,
                message: "Stocks fetched successfully",
                data: result.data.map((stock: any) => stock.toPersistence ? stock.toPersistence() : stock),
                page: Number(page) || 1,
                limit: Number(limit) || 20,
                total: result.total,
            });
        } catch (error) {
            next(error)
        }
    }
}
