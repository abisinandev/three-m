export type NavHistory = {
    nav: number;
    navDate: string;
    interval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
};

export type FundDetails = {
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
    navHistory: NavHistory[];
};


export type ChartPoint = { date: string; nav: number };
