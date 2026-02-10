import { MarketNewsArticle } from "@application/dto/market-news/market-news.dto";

export interface IMarketNewsServices {
    getTopMarketNews(category?: string): Promise<MarketNewsArticle[]>;
    searchMarketNews(query: string, category?: string): Promise<MarketNewsArticle[]>;
}