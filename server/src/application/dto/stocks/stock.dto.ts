export interface StockDTO {
    symbol: string;
    name: string;
    exchange: string;
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