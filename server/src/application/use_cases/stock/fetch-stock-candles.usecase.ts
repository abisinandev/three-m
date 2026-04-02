import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { FetchStockCandlesInput, IFetchStockCandlesUseCase } from "./interfaces/fetch-stock-candles.interface";
import { IYahooProvider } from "@application/interfaces/services/stocks/yahoo-provider.interface";
import { CandleMapper } from "@application/mappers/stock/candle.mapper";
import { CandlesResponseDTO } from "@application/dto/stocks/candle.dto";

@injectable()
export class FetchStockCandlesUseCase implements IFetchStockCandlesUseCase {
    constructor(
        @inject(STOCK_TYPES.YahooProvider) private readonly yahooProvider: IYahooProvider,
    ) { }

    async execute(input: FetchStockCandlesInput): Promise<CandlesResponseDTO> {
        const { symbol, resolution } = input;

        const { from, to } = this.normalizeTime(input);
        const interval = this.mapResolution(resolution);

        const rawCandles = await this.yahooProvider.getHistoricalData({
            symbol,
            period1: from,
            period2: to,
            interval,
        });

        if (!rawCandles || rawCandles.length === 0) {
            return {
                s: 'no_data',
                t: [], o: [], h: [], l: [], c: [], v: []
            };
        }

        const candleEntities = CandleMapper.toEntityList(rawCandles);

        return CandleMapper.toResponse(candleEntities);
    }

    private mapResolution(res: string): '1m' | '5m' | '15m' | '1h' | '1d' {
        switch (res) {
            case '1': return '1m';
            case '5': return '5m';
            case '15': return '15m';
            case '30': return '15m';
            case '60': return '1h';
            case 'D': return '1d';
            case 'W': return '1h';
            default: return '1m';
        }
    }

    private normalizeTime(input: FetchStockCandlesInput) {
        let { from, to } = input;

        const now = Math.floor(Date.now() / 1000);

        if (!to || isNaN(to)) to = now;
        if (!from || isNaN(from)) from = to - 86400;

        // Handle milliseconds if provided
        if (from > 1e12) from = Math.floor(from / 1000);
        if (to > 1e12) to = Math.floor(to / 1000);

        if (to > now) to = now;

        if (from >= to) {
            from = to - 3600; // Default to last 1 hour if ranges are invalid
        }

        return { from, to };
    }
}
