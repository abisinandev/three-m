export interface StockFilters {
    page?: number;
    limit?: number;
    search?: string;
    exchange?: string;
    isTradable?: boolean | string;
    isVisible?: boolean | string;
}
export interface StockResult {
    symbol: string;
    name: string;
    exchange: string;
    country: string;
    currency: string;
}
