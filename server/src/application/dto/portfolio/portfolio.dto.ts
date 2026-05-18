import { AssetType } from "@domain/entities/portfolio/enum/asset-type";
import { PortfolioStatus } from "@domain/entities/portfolio/enum/portfolio-status";

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
    status?: PortfolioStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
