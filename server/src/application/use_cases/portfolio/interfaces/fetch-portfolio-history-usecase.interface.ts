import { QueryOptions } from "mongoose";

export interface PortfolioHistoryDTO {
    assetName: string;
    assetType: "STOCK" | "MF";
    side: "BUY" | "SELL" | "REDEEMED" | "INVESTED" | "ALLOTTED";
    quantity: number;
    price: number;
    totalAmount: number;
    status: string;
    date: Date;
}

export interface IFetchPortfolioHistoryUseCase {
    execute(userId: string, options: QueryOptions): Promise<{
        data: PortfolioHistoryDTO[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
