import YahooFinance from 'yahoo-finance2';
import { ICandle } from '../interfaces/candle.interface';
import { injectable } from 'inversify';
import { IHistoricalDataParams, IQuote, IYahooProvider } from '@application/interfaces/services/stocks/yahoo-provider.interface';

const yahooFinance = new YahooFinance();
const MAX_DAYS: Record<string, number> = {
    '1m': 7,
    '5m': 60,
    '15m': 60,
    '1h': 730,
    '1d': 3650,
};

@injectable()
export class YahooProvider implements IYahooProvider {

    async getHistoricalData(params: IHistoricalDataParams): Promise<ICandle[]> {
        const { symbol, period1, period2, interval = '1m' } = params;

        try {
            const maxDays = MAX_DAYS[interval] ?? 7;
            const minPeriod1 = Math.floor(Date.now() / 1000) - maxDays * 86400;
            const clampedPeriod1 = Math.max(period1, minPeriod1);

            const p1 = new Date(clampedPeriod1 * 1000);
            const p2 = new Date(period2 * 1000);

            const result: any = await yahooFinance.chart(symbol, {
                period1: p1,
                period2: p2,
                interval,
            });

            if (!result?.quotes?.length) return [];

            return result.quotes
                .filter((q: any) => q.open != null && q.close != null)
                .map((quote: any) => ({
                    symbol,
                    timeframe: interval,
                    time: Math.floor(new Date(quote.date).getTime() / 1000),
                    open: quote.open ?? 0,
                    high: quote.high ?? 0,
                    low: quote.low ?? 0,
                    close: quote.close ?? 0,
                    volume: quote.volume ?? 0,
                    isComplete: true,
                }));
        } catch {
            return [];
        }
    }

    async getLatestQuote(symbol: string): Promise<IQuote | null> {
        try {
            const result: any = await yahooFinance.quote(symbol);
            if (!result?.regularMarketPrice) return null;

            return {
                price: result.regularMarketPrice,
                timestamp: result.regularMarketTime
                    ? Math.floor(new Date(result.regularMarketTime).getTime() / 1000)
                    : Math.floor(Date.now() / 1000),
            };
        } catch {
            return null;
        }
    }
}

