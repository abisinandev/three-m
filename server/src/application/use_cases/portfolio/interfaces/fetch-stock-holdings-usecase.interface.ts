import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { QueryOptions } from "mongoose";

export interface IFetchStockHoldingsUseCase {
    execute(userId: string, options: QueryOptions): Promise<{
        data: InvestmentResponseDTO[];
        page: number;
        limit: number;
        totalCount: number;
    }>;
}
