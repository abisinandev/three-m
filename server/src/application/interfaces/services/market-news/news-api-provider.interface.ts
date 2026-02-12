import { MarketNewsArticle } from "@application/dto/market-news/market-news.dto";
import { MarketNews } from "@application/dto/market-news/MarketNews";

export interface INewsApiProvider {
    getTopHeadlines(category?: string): Promise<MarketNews[]>;
    searchNews(query: string, category?: string): Promise<MarketNewsArticle[]>;
}