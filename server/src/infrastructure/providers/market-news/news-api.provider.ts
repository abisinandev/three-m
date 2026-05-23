import { IMarketNewsProvider, RawNewsArticle } from "@application/interfaces/services/market-news/news-api-provider.interface";
import { env } from "@presentation/express/utils/constants/env.constants";
import axios from "axios";

export class NewsApiProvider implements IMarketNewsProvider {
    private readonly baseUrl = env.MARKET_NEWS_API;
    private readonly apiKey = env.MARKET_NEWS_API_KEY;

    private readonly validCategories = ["business", "entertainment", "general", "health", "science", "sports", "technology"];

    private readonly categoryQueryMap: Record<string, string> = {
        "stocks": "Indian stock market NSE BSE",
        "mutual funds": "India SIP mutual funds investment",
        "economy": "Indian economy GDP inflation news", 
        "rbi": "Reserve Bank of India RBI repo rate policy",
        "global markets": "global financial markets nasdaq dow jones",
        "crypto": "cryptocurrency India regulation bitcoin",
        "commodities": "gold oil silver commodities market India"
    };

    async getTopHeadlines(category?: string): Promise<RawNewsArticle[]> {
        const lowerCategory = category?.toLowerCase().trim();
        const isValidCategory = this.validCategories.includes(lowerCategory || "");

        if (!lowerCategory || lowerCategory === "all") {
            return this.fetchTopHeadlines("business");
        }

        if (isValidCategory) {
            return this.fetchTopHeadlines(lowerCategory);
        }

        const searchQuery = this.categoryQueryMap[lowerCategory] || lowerCategory;
        return this.searchNews(searchQuery);
    }

    private async fetchTopHeadlines(category: string): Promise<RawNewsArticle[]> {
        const response = await axios.get(
            `${this.baseUrl}/top-headlines`,
            {
                params: {
                    apiKey: this.apiKey,
                    category: category,
                    language: "en",
                    pageSize: 20,
                },
            }
        );

        return Array.isArray(response.data?.articles) ? response.data.articles : [];
    }

    async searchNews(query: string, category?: string): Promise<RawNewsArticle[]> {
        let finalQuery = query?.trim();
        const lowerCategory = category?.toLowerCase().trim();

        if (lowerCategory && lowerCategory !== "all" && lowerCategory !== "") {
            const categoryContext = this.categoryQueryMap[lowerCategory] || lowerCategory;
            finalQuery = finalQuery ? `${finalQuery} ${categoryContext}` : categoryContext;
        }

        if (!finalQuery) finalQuery = "Indian market news";

        const response = await axios.get(`${this.baseUrl}/everything`, {
            params: {
                q: finalQuery,
                language: "en",
                sortBy: "publishedAt",
                pageSize: 30
            },
            headers: { "X-Api-Key": this.apiKey }
        });

        return Array.isArray(response.data?.articles) ? response.data.articles : [];
    }
}
