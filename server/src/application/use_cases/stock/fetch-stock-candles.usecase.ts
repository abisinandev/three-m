import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IFinnhubService } from "@application/interfaces/services/stocks/finnhub-service.interface";
import { IFetchStockCandlesUseCase } from "./interfaces/fetch-stock-candles.interface";

@injectable()
export class FetchStockCandlesUseCase implements IFetchStockCandlesUseCase {
    constructor(
        @inject(STOCK_TYPES.FinnhubService) private readonly finnhubService: IFinnhubService
    ) {}

    async execute(symbol: string, resolution: string, from: number, to: number): Promise<any> {
        const data = await this.finnhubService.getCandles(symbol, resolution, from, to);
        return data || {}; 
    }
}
