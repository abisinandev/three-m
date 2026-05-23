import { QueryOptions } from "mongoose";

export interface PortfolioAssetQueryDTO extends QueryOptions {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
