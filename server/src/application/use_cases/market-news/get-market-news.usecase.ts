import { IMarketNewsServices } from "@application/interfaces/services/market-news/market-news.service.interface";
import { MARKET_NEWS_TYPES } from "@infrastructure/inversify_di/features/market-news/market-news.types";
import { inject, injectable } from "inversify";
import { IGetMarketNewsUseCase } from "./interfaces/get-market-news-usecase.interfac";
import { MarketNewsArticle } from "@application/dto/market-news/market-news.dto";

@injectable()
export class GetMarketNewsUseCase implements IGetMarketNewsUseCase {
    constructor(
        @inject(MARKET_NEWS_TYPES.MarketNewsServices) private readonly _marketNewsService: IMarketNewsServices,
    ) { }

    async execute(query?: string, category?: string): Promise<MarketNewsArticle[]> {
        if (query && query.trim() !== "") {
            return this._marketNewsService.searchMarketNews(query, category);
        }
        return this._marketNewsService.getTopMarketNews(category);
    }
}
