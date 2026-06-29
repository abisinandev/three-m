export interface Stock {
    _id: string;
    symbol: string;
    name: string;
    exchange: string;
    sector: string;
    logo?: string | null;
    isTradable: boolean;
    isVisible: boolean;
    price?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface StockFilters {
    page: number;
    limit: number;
    search: string;
    exchange: string;
    isTradable: string;
    isVisible: string;
}

export interface StockPaginatedResponse {
    data: Stock[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export type StockStatusKey = 'isTradable' | 'isVisible';
