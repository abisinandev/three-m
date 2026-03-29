export interface StockDTO {
    id: string;
    symbol: string;
    name: string;
    exchange: string;
    logo: string | null;
    sector?: string;
    isTradable: boolean;
    isVisible: boolean;
    isTracked: boolean;
}

export interface Trade {
    symbol: string;
    price: number;
    timestamp: number;
}


export interface StockQueryOptions {
    page: number;
    limit: number;
    search?: string;
    exchange?: string;
    isTradable?: boolean;
    isTracked?: boolean;
    isVisible?: boolean;
    sort?: Record<string, 1 | -1>;
}