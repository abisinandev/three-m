import { AssetType } from "@domain/entities/portfolio/enum/asset-type";

export interface PortfolioDTO {
    id?: string;
    userId: string;
    assetId: string;
    assetType: AssetType;
    quantity?: number;
    units?: number;
    avgPrice: number;
    investedAmount: number;
    lockQty: number;
    stopLoss?: number | null;
    takeProfit?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}
