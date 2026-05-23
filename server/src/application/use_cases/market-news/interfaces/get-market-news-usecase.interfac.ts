import { MarketNewsResponse } from "@application/dto/market-news/market-news.dto";

export interface IGetMarketNewsUseCase {
    execute(query?: string, category?: string, page?: number, pageSize?: number): Promise<MarketNewsResponse>;
}