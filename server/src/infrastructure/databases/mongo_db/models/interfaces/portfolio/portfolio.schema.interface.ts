import { AssetType } from "@domain/entities/portfolio/enum/asset-type";
import { PortfolioStatus } from "@domain/entities/portfolio/enum/portfolio-status";
import { Types } from "mongoose";

export interface IPortfolio {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    assetId: Types.ObjectId;
    assetType: AssetType;
    quantity?: number;
    units?: number;
    avgPrice: number;
    investedAmount: number;
    lockQty: number;
    status: PortfolioStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
