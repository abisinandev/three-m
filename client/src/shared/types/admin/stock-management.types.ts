export interface StockFilters {
    page?: number;
    limit?: number;
    search?: string;
    exchange?: string;
    isTradable?: boolean | string;
    isVisible?: boolean | string;
}
