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

export type MutualFundType = {
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


export type PaginatedMutualFundsResponse = {
    data: MutualFundType[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalActiveFunds: number;
    totalInactiveFunds: number;
};