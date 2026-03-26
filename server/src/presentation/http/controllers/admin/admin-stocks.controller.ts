import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { IAdminStocksUseCase } from "@application/use_cases/admin/interfaces/admin-stocks-usecase.interface";

@injectable()
export class AdminStocksController {
    constructor(
        @inject(ADMIN_TYPES.AdminStocksUseCase)
        private adminStocksUseCase: IAdminStocksUseCase
    ) {}

    async getStocks(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 20, search, exchange, isTradable, isTracked, isVisible } = req.query;
            
            const filters = {
                search: search as string,
                exchange: exchange as string,
                isTradable: isTradable as string,
                isTracked: isTracked as string,
                isVisible: isVisible as string,
            };

            const result = await this.adminStocksUseCase.getStocks(
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
                totalPages: Math.ceil(result.total / (Number(limit) || 20))
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error", error });
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const symbol = req.params.symbol as string;
            const { isTradable, isTracked, isVisible } = req.body;

            const updated = await this.adminStocksUseCase.updateStockStatus(symbol, {
                ...(isTradable !== undefined && { isTradable }),
                ...(isTracked !== undefined && { isTracked }),
                ...(isVisible !== undefined && { isVisible }),
            });

            if (updated) {
                res.status(200).json({ success: true, message: "Stock status updated successfully" });
            } else {
                res.status(404).json({ success: false, message: "Stock not found or not modified" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error", error });
        }
    }
}
