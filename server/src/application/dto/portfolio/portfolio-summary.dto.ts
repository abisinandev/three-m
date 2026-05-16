

export interface PortfolioSummaryDTO {
    totalCount: number;
    totalInvestment: number;
    totalProfit: number;
    profitAfterSell: number;
    totalReturns: number;
    profitPercentage: number;
    currentValue: number;
    xirr: number | null;
    allocations?: { assetType: string; currentValue: number }[];
}