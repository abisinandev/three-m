import { MarketNewsArticle } from "@application/dto/market-news/market-news.dto";

export interface RawNewsArticle {
    title: string;
    description?: string | null;
    url: string;
    urlToImage?: string | null;
    source?: {
        id?: string | null;
        name?: string | null;
    };
    publishedAt: string;
    content?: string | null;
    author?: string | null;
}

export interface IMarketNewsProvider {
    getTopHeadlines(category?: string): Promise<RawNewsArticle[]>;
    searchNews(query: string, category?: string): Promise<RawNewsArticle[]>;
}