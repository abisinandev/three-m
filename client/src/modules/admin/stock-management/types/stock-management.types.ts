export interface Stock {
    _id: string;
    symbol: string;
    name: string;
    exchange: string;
    sector: string;
    logo?: string | null;
    isTradable: boolean;
    isTracked: boolean;
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
    isTracked: string;
    isVisible: string;
}

export type StockStatusKey = 'isTradable' | 'isTracked' | 'isVisible';
