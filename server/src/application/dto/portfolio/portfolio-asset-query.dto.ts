import { QueryOptions } from "mongoose";

export interface PortfolioAssetQueryDTO extends QueryOptions {
    assetType?: "MF" | "STOCK" | "ALL";
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
