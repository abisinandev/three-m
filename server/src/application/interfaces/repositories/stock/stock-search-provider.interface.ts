export interface ISearchedStock {
    symbol: string;
    name: string;
    exchange: string;
    country: string;
    currency: string;
    type: string;
}

export interface IStockSearchProvider {
    search(query: string): Promise<ISearchedStock[]>;
}
