export interface MarketNewsArticle {
    title: string;
    description: string | null;
    url: string;
    image: string | null;
    source: string;
    publishedAt: string;
}