export type AddFundPayload = {
    schemeCode: string;
    schemeName: string;
    amc: string;
    category: string;
    subCategory: string;
    risk: string;
    logo?: string;
};

export type FetchMutualFundsFilters = {
    page: number;
    search: string;
    sort: string;
};
