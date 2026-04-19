export interface IInvestmentResponse {
    id?: string;
    userId: string;
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
    createdAt: Date | string;
    updatedAt?: Date | string;
    quantity: number;
    profit: number;
    xirr?: number;
    logo?: string;
    remainingUnits?: number;
    redeemedUnits?: number;
    redeemedAmount?: number;
    redeemedAt?: Date | string;
}

export interface IInvestmentBaseResponse {
    data: IInvestmentResponse[];
    page: number | string;
    limit: number | string;
    totalCount?: number;
}

export interface IPortfolioDatasResponse {
    totalCount: number;
    totalInvestment: number;
    totalProfit: number;
    realizedProfit: number;
    totalReturns: number;
    currentValue: number;
    profitPercentage: number;
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
