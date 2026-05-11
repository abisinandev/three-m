import { ClientSession } from "mongoose";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";

export interface IPortfolioService {
    updateOrCreatePortfolio(
        userId: string,
        assetId: string,
        assetType: AssetType,
        amount: number,
        price: number,
        session: ClientSession,
        riskLevels?: { stopLoss?: number | null, takeProfit?: number | null }
    ): Promise<void>;

    decreaseOrDeletePortfolio(
        userId: string,
        assetId: string,
        quantity: number,
        session: ClientSession
    ): Promise<void>;
}
