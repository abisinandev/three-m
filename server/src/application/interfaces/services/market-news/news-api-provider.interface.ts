export interface INewsApiProvider {
    getTopHeadlines(category?: string): Promise<any[]>;
    searchNews(query: string, category?: string): Promise<any[]>;
}