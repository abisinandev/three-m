export interface MarketNewsArticle {
    title: string;
    description: string | null;
    url: string;
    image: string | null;
    source: string;
    publishedAt: string;
}

export interface MarketNewsResponse {
    articles: MarketNewsArticle[];
    total: number;
    page: number;
    pageSize: number;
}