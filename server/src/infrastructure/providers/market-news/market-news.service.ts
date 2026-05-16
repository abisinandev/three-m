import { MarketNewsArticle, MarketNewsResponse } from "@application/dto/market-news/market-news.dto";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { IMarketNewsServices } from "@application/interfaces/services/market-news/market-news.service.interface";
import { IMarketNewsProvider, RawNewsArticle } from "@application/interfaces/services/market-news/news-api-provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { MARKET_NEWS_TYPES } from "@infrastructure/inversify_di/features/market-news/market-news.types";
import { inject, injectable, multiInject } from "inversify";
import crypto from "node:crypto";

@injectable()
export class MarketNewsServices implements IMarketNewsServices {

    constructor(
        @multiInject(MARKET_NEWS_TYPES.NewsApiProvider) private readonly _providers: IMarketNewsProvider[],
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _cacheProvider: ICacheProvider,
    ) { }

    async getTopMarketNews(category?: string, page = 1, pageSize = 10): Promise<MarketNewsResponse> {
        const categoryKey = category ? category.toLowerCase().trim() : "all";
        const cacheKey = `news:${categoryKey}:top`;

        let processed: MarketNewsArticle[];
        const cached = await this._cacheProvider.get(cacheKey);

        if (cached) {
            processed = JSON.parse(cached);
        } else {
            const results = await Promise.allSettled(
                this._providers.map(p => p.getTopHeadlines(category))
            );

            const allArticles = results
                .filter((r): r is PromiseFulfilledResult<RawNewsArticle[]> => r.status === "fulfilled")
                .flatMap(r => r.value);

            processed = this.processArticles(allArticles);
            await this._cacheProvider.set(cacheKey, JSON.stringify(processed), 600);
        }

        return this.paginate(processed, page, pageSize);
    }

    async searchMarketNews(query: string, category?: string, page = 1, pageSize = 10): Promise<MarketNewsResponse> {
        const categoryKey = category ? category.toLowerCase().trim() : "all";
        const queryKey = query.toLowerCase().trim();
        const cacheKey = `news:${categoryKey}:${queryKey}`;

        let processed: MarketNewsArticle[];
        const cached = await this._cacheProvider.get(cacheKey);

        if (cached) {
            processed = JSON.parse(cached);
        } else {
            const results = await Promise.allSettled(
                this._providers.map(p => p.searchNews(query, category))
            );

            const allArticles = results
                .filter((r): r is PromiseFulfilledResult<RawNewsArticle[]> => r.status === "fulfilled")
                .flatMap(r => r.value);

            processed = this.processArticles(allArticles);
            await this._cacheProvider.set(cacheKey, JSON.stringify(processed), 300);
        }

        return this.paginate(processed, page, pageSize);
    }

    private paginate(articles: MarketNewsArticle[], page: number, pageSize: number): MarketNewsResponse {
        const total = articles.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedArticles = articles.slice(start, end);

        return {
            articles: paginatedArticles,
            total,
            page,
            pageSize
        };
    }

    private processArticles(rawArticles: RawNewsArticle[]): MarketNewsArticle[] {
        let articles = NewsNormalizer.normalize(rawArticles);
        articles = this.deduplicate(articles);
        return this.rankAndSort(articles);
    }

    private deduplicate(articles: MarketNewsArticle[]): MarketNewsArticle[] {
        const seen = new Set<string>();
        return articles.filter(article => {
            // URL Hash
            const urlHash = crypto.createHash("md5").update(article.url).digest("hex");

            const titleSlug = article.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);

            if (seen.has(urlHash) || seen.has(titleSlug)) return false;

            seen.add(urlHash);
            seen.add(titleSlug);
            return true;
        });
    }

    private rankAndSort(articles: MarketNewsArticle[]): MarketNewsArticle[] {
        const sourceReliability: Record<string, number> = {
            "Reuters": 100,
            "Bloomberg": 95,
            "The Economic Times": 90,
            "Yahoo Finance": 80,
            "Business Standard": 85,
            "Livemint": 85
        };

        const highValueKeywords = ["rbi", "nse", "bse", "india", "sensex", "nifty", "economy"];

        return articles
            .map(article => {
                let score = sourceReliability[article.source] || 50;

                const content = (`${article.title} ${article.description || ""}`).toLowerCase();
                highValueKeywords.forEach(kw => {
                    if (content.includes(kw)) score += 10;
                });

                const hoursOld = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
                if (hoursOld < 24) score += (24 - hoursOld) * 2;

                return { ...article, score };
            })
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .map(({ score, ...rest }) => rest as MarketNewsArticle);
    }
}

export const NewsNormalizer = {
    normalize: (rawArticles: RawNewsArticle[]): MarketNewsArticle[] => {
        return rawArticles.map(article => ({
            title: article.title?.trim() || "Untitled Financial News",
            description: article.description?.trim() || null,
            url: article.url,
            image: article.urlToImage || null,
            source: article.source?.name || "Market Source",
            publishedAt: NewsNormalizer.isValidDate(article.publishedAt) ? article.publishedAt : new Date().toISOString()
        }));
    },

    isValidDate: (dateStr: string): boolean => {
        return !Number.isNaN(Date.parse(dateStr));
    }
}