export interface MarketNews {
    title: string;
    description: string | null;
    url: string;
    image: string | null;
    source: string;
    publishedAt: string;
}

export interface MarketNewsResponse {
    articles: MarketNews[];
    total: number;
    page: number;
    pageSize: number;
}
