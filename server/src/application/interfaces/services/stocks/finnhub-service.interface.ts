export interface IFinnhubService {
    getQuote(symbol: string): Promise<number | null>;
    getCandles(symbol: string, resolution: string, from: number, to: number): Promise<any>;
}