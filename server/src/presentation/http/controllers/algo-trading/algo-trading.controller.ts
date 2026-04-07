import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { GetStrategiesUseCase } from "@application/use_cases/algo-trading/get-strategies.usecase";

@injectable()
export class AlgoTradingController {
    constructor(
        @inject(STOCK_TYPES.GetStrategiesUseCase) private readonly getStrategiesUseCase: GetStrategiesUseCase
    ){}

    public getStrategies = async (req: Request, res: Response): Promise<void> => {
        try {
            const list = this.getStrategiesUseCase.execute();
            res.json({ success: true, count: list.length, data: list });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}