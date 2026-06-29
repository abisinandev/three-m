export interface StockResponseDtos {
    symbol: string,
    exchange: string,
    name: string,
    sector: string,
    logo: string | null,
    isTradable: boolean,
    isVisible: boolean,
    createdAt: Date,
}