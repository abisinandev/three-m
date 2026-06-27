export interface IInvestmentResponse {
    assetId: string;
    symbol?: string;
    name?: string;
    assetType?: "MF" | "STOCK";
    
    schemeCode: string;
    amount: number;
    units?: number;
    nav?: number;
    navDate?: Date | string;
    schemeName: string;
    category: string;
    status: string;
    paymentMethod: string;
    investmentType: string;
    
    quantity: number;
    avgPrice?: number;
    investedAmount?: number;
    currentPrice?: number;
    currentValue?: number;
    profit: number;
    profitPercentage?: number;
    stopLoss?: number;
    takeProfit?: number;
    xirr?: number;
    logo: string;
    remainingUnits?: number;
    redeemedUnits?: number;
    redeemedAmount?: number;
    redeemedAt?: Date | string;
    createdAt: Date | string;
    updatedAt?: Date | string;
}

export interface IInvestmentBaseResponse {
    data: IInvestmentResponse[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IPortfolioSummaryResponse {
    totalCount: number;
    totalInvestment: number;
    totalProfit: number;
    profitAfterSell: number;
    totalReturns: number;
    currentValue: number;
    profitPercentage: number;
    xirr: number | null;
    allocations?: {
        assetType: string;
        currentValue: number;
    }[];
}

export interface IRedeemedInvestment {
    mfId: string;
    schemeName: string;
    schemeCode: string;
    amc: string;
    category: string;
    logo?: string;
    nav: number;
    navDate: string;
    totalInvestment: number;
    currentValue: number;
    profit: number;
    totalUnits: number;
    risk: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    roi: number;
}

export interface IPortfolioProjectionResponse {
    projectedValue: number;
    projectedProfit: number;
    futureTotalInvestment: number;
    yearlyBreakdown: { year: number; value: number }[];
}
export interface IPortfolioHistoryItem {
    id: string;
    userId: string;
    assetId: string;
    assetName: string;
    assetType: "STOCK" | "MF";
    side: string;
    quantity: number;
    price: number;
    totalAmount: number;
    status: string;
    date: Date | string;
    orderType?: string;
    exchange?: string;
    productType?: string;
    triggerPrice?: number;
}

export interface IPortfolioHistoryResponse {
    data: IPortfolioHistoryItem[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
