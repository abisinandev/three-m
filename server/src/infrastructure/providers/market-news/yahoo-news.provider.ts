import { IMarketNewsProvider, RawNewsArticle } from "@application/interfaces/services/market-news/news-api-provider.interface";
import { env } from "@presentation/express/utils/constants/env.constants";
import axios from "axios";
import * as cheerio from "cheerio";

export class YahooNewsProvider implements IMarketNewsProvider {
    private readonly categoryFeedMap: Record<string, string> = {
        "stocks": env.YAHOO_FINANCE_RSS_STOCKS,
        "mutual funds": env.YAHOO_FINANCE_RSS_DEFAULT,
        "economy": env.YAHOO_FINANCE_RSS_DEFAULT,
        "rbi": env.YAHOO_FINANCE_RSS_DEFAULT,
        "global markets": env.YAHOO_FINANCE_RSS_STOCKS,
        "crypto": env.YAHOO_FINANCE_RSS_CRYPTO,
        "commodities": env.YAHOO_FINANCE_RSS_DEFAULT
    };

    private readonly defaultFeed = env.YAHOO_FINANCE_RSS_DEFAULT;

    async getTopHeadlines(category?: string): Promise<RawNewsArticle[]> {
        const lowerCategory = category?.toLowerCase().trim() || "all";
        const feedUrl = this.categoryFeedMap[lowerCategory] || this.defaultFeed;

        return this.fetchRss(feedUrl);
    }

    async searchNews(query: string, category?: string): Promise<RawNewsArticle[]> {

        const lowerCategory = category?.toLowerCase().trim() || "all";
        const feedUrl = this.categoryFeedMap[lowerCategory] || this.defaultFeed;

        const articles = await this.fetchRss(feedUrl);

        if (query) {
            const lowerQuery = query.toLowerCase();
            return articles.filter(a =>
                a.title.toLowerCase().includes(lowerQuery) ||
                a.description?.toLowerCase().includes(lowerQuery)
            );
        }

        return articles;
    }

    private async fetchRss(url: string): Promise<RawNewsArticle[]> {
        try {
            const response = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept": "application/xml, text/xml, */*",
                    "Accept-Encoding": "gzip, deflate"
                },
                timeout: 10000
            });
            const $ = cheerio.load(response.data, { xmlMode: true });
            const articles: RawNewsArticle[] = [];

            $("item").each((_, el) => {
                const $item = $(el);
                const title = $item.find("title").text();
                const link = $item.find("link").text();
                const description = $item.find("description").text();
                const pubDate = $item.find("pubDate").text();

                const imageUrl = $item.find("media\\:content").attr("url") ||
                    $item.find("enclosure").attr("url") || null;

                articles.push({
                    title,
                    description,
                    url: link,
                    urlToImage: imageUrl,
                    source: { name: "Yahoo Finance" },
                    publishedAt: new Date(pubDate).toISOString()
                });
            });

            return articles;
        } catch (error) {
            console.error(`YahooNewsProvider Error fetching ${url}:`, error);
            return [];
        }
    }
}
