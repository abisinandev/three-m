
export interface PortfolioAssetResponseDTO {
    id: string;
    userId: string;
    assetId: string;
    symbol: string;
    name: string;
    schemeName?: string;
    schemeCode?: string;
    assetType: "MF" | "STOCK";
    quantity: number;
    avgPrice: number;
    investedAmount: number;
    currentPrice: number;
    currentValue: number;
    profit: number;
    profitPercentage: number;
    status: string;
    logo: string;
    category?: string;
    xirr?: number;
    updatedAt?: Date;
    createdAt: Date;
}

export interface PaginatedPortfolioAssetsResponseDTO {
    data: PortfolioAssetResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
