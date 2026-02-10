import { MarketNewsArticle } from "@application/dto/market-news/market-news.dto";

export interface IGetMarketNewsUseCase {
    execute(query?: string, category?: string): Promise<MarketNewsArticle[]>;
}