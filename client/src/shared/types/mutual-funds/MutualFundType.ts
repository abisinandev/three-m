export type FundCategory = 'Equity' | 'Debt' | 'Hybrid' | 'Index';

export type SubCategory =
    | 'Large Cap'
    | 'Mid Cap'
    | 'Small Cap'
    | 'Flexi Cap'
    | 'Multi Cap'
    | 'ELSS'
    | 'Index'
    | 'Other';


export type RiskLevel = 'Low' | 'Medium' | 'High';

export type FundStatus = 'Active' | 'Inactive';

export interface IMutualFund {
    id: string;
    schemeCode: string;
    schemeName: string;
    source: string;
    amc: string;
    cagr: {
        cagr1Y?: number;
        cagr3Y?: number;
        cagr5Y?: number;
        updatedAt: string;
    },
    category: FundCategory;
    subCategory: SubCategory;
    risk: RiskLevel;
    status: FundStatus;
    logo: string;

    nav: number;
    navDate: Date

    createdAt: string;
    updatedAt: string;
};


export interface PaginatedMutualFundsResponse {
    data: IMutualFund[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalActiveFunds: number;
    totalInactiveFunds: number;
    totalInvestments: number;
};

export interface INavHistory {
    nav: number;
    navDate: string;
    interval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

export interface IFundDetails {
    id: string;
    schemeCode: string;
    schemeName: string;
    amc: string;
    category: string;
    subCategory: string;
    risk: string;
    status: string;
    nav: number;
    navDate: string;
    absoluteReturn: number;
    logo: string;
    navHistory: INavHistory[];
}

export interface IChartPoint {
    date: string;
    nav: number;
}