import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { GetUserStocksUseCase } from "@application/use_cases/user/stocks/get-user-stocks.use-case";

@injectable()
export class UserStocksController {
    constructor(
        @inject(USER_TYPES.GetUserStocksUseCase) private getUserStocksUseCase: GetUserStocksUseCase
    ) {}

    async getStocks(req: Request, res: Response) {
        try {
            const { page = 1, limit = 20, search, exchange } = req.query;

            const filters = {
                search: search as string,
                exchange: exchange as string
            };

            const result = await this.getUserStocksUseCase.execute(
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
            console.error("Error fetching user stocks: ", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}
