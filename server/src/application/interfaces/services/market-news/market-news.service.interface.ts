import { MarketNewsResponse } from "@application/dto/market-news/market-news.dto";

export interface IMarketNewsServices {
    getTopMarketNews(category?: string, page?: number, pageSize?: number): Promise<MarketNewsResponse>;
    searchMarketNews(query: string, category?: string, page?: number, pageSize?: number): Promise<MarketNewsResponse>;
}