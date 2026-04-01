import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { AlpacaProvider } from "@infrastructure/providers/stocks/alpaca.provider";
import { IFetchStockCandlesUseCase } from "./interfaces/fetch-stock-candles.interface";
import { CandleModel } from "@infrastructure/databases/mongo_db/models/schemas/stock-candle.schema";

@injectable()
export class FetchStockCandlesUseCase implements IFetchStockCandlesUseCase {
    constructor(
        @inject(STOCK_TYPES.AlpacaProvider) private readonly alpacaProvider: AlpacaProvider
    ) {}

    async execute(symbol: string, resolution: string, from: number, to: number): Promise<any> {
        const mapTimeframe = (res: string) => {
            switch (res) {
                case '1': return '1m';
                case '5': return '5m';
                case '15': return '15m';
                case '30': return '30m';
                case '60': return '1h';
                case 'D': return '1d';
                default: return '1m';
            }
        }
        const timeframe = mapTimeframe(resolution);
        
        try {
            const start = new Date(from * 1000);
            const end = new Date(to * 1000);
            
            const candles = await this.alpacaProvider.getHistoricalCandles(symbol, timeframe, start, end);
            console.log('Candles: ', candles);
            
            if (candles.length > 0) {
               Promise.all(candles.map(c => 
                   CandleModel.updateOne(
                       { symbol: c.symbol, timeframe: c.timeframe, time: c.time },
                       { $set: c },
                       { upsert: true }
                   )
               )).catch(e => console.error("DB Store Error:", e));

               return {
                    s: 'ok',
                    t: candles.map(c => c.time),
                    o: candles.map(c => c.open),
                    h: candles.map(c => c.high),
                    l: candles.map(c => c.low),
                    c: candles.map(c => c.close),
                    v: candles.map(c => c.volume),
                };
            }
            return { s: 'no_data', t: [], o: [], h: [], l: [], c: [], v: [] };
        } catch (error) {
            console.error("Fetch candles error", error);
            return { s: 'no_data', t: [], o: [], h: [], l: [], c: [], v: [] };
        }
    }
}

