export interface IFinnhubService {
    getQuote(symbol: string): Promise<number | null>;
}