import { MarketNewsArticle } from "@application/dto/market-news/market-news.dto";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { IMarketNewsServices } from "@application/interfaces/services/market-news/market-news.service.interface";
import { INewsApiProvider } from "@application/interfaces/services/market-news/news-api-provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { MARKET_NEWS_TYPES } from "@infrastructure/inversify_di/features/market-news/market-news.types";
import { inject, injectable } from "inversify";

@injectable()
export class MarketNewsServices implements IMarketNewsServices {

    constructor(
        @inject(MARKET_NEWS_TYPES.NewsApiProvider) private readonly _newApiProvider: INewsApiProvider,
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _cacheProvider: ICacheProvider,
    ) { }

    async getTopMarketNews(category?: string): Promise<MarketNewsArticle[]> {
        const categoryKey = category ? category.toLowerCase() : "business";
        const cacheKey = `market_news:top:${categoryKey}`;

        const cached = await this._cacheProvider.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const rawArticles = await this._newApiProvider.getTopHeadlines(category);
        const articles = NewsNormalizer.normalize(rawArticles);

        await this._cacheProvider.set(cacheKey, JSON.stringify(articles), 600);

        return articles;
    }

    async searchMarketNews(query: string, category?: string): Promise<MarketNewsArticle[]> {
        const categoryKey = category ? category.toLowerCase() : "all";
        const cacheKey = `market_news:search:${query.toLowerCase()}:${categoryKey}`;

        const cached = await this._cacheProvider.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const rawArticles = await this._newApiProvider.searchNews(query, category);
        const articles = NewsNormalizer.normalize(rawArticles);

        await this._cacheProvider.set(cacheKey, JSON.stringify(articles), 300);

        return articles;
    }
}



export class NewsNormalizer {
    static normalize(rawArticles: any[]): MarketNewsArticle[] {
        return rawArticles.map(article => ({
            title: article.title,
            description: article.description ?? null,
            url: article.url,
            image: article.urlToImage ?? null,
            source: article.source?.name ?? "Unknown",
            publishedAt: article.publishedAt
        }));
    }
}