
export interface PortfolioAssetDTO {
    id: string;
    userId: string;
    assetId: string;
    symbol: string;
    name: string;
    schemeName?: string;
    schemeCode?: string;
    assetType: "MF" | "STOCK";
    quantity: number;
    units?: number;          // MF: units held
    avgPrice: number;
    nav?: number;            // MF: current NAV
    navDate?: Date | string; // MF: NAV date
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

export interface PortfolioAssetsResponseDTO {
    data: PortfolioAssetDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
