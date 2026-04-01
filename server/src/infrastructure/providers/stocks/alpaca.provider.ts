import axios from "axios";
import { injectable } from "inversify";
import { env } from "@presentation/express/utils/constants/env.constants";
import { Candle } from "@domain/entities/stock/candle.entity";
import { IAlpacaProvider } from "@application/interfaces/services/stocks/alpaca-provider.interface";

@injectable()
export class AlpacaProvider implements IAlpacaProvider {
    private readonly baseUrl = env.ALPACA_BASE_URL;
    private readonly apiKey = env.ALPACA_API_KEY;
    private readonly apiSecret = env.ALPACA_API_SECRET;

    public async getHistoricalCandles(
        symbol: string,
        timeframe: string,
        start: Date,
        end: Date
    ): Promise<Candle[]> {
        
        let alpacaTimeframe = "1Min";
        switch (timeframe) {
            case "1m": alpacaTimeframe = "1Min"; break;
            case "5m": alpacaTimeframe = "5Min"; break;
            case "15m": alpacaTimeframe = "15Min"; break;
            case "1h": alpacaTimeframe = "1Hour"; break;
            case "1d": alpacaTimeframe = "1Day"; break;
            default: alpacaTimeframe = "1Min"; break;
        }

        try { 
            const response = await axios.get(
                `${this.baseUrl}/v2/stocks/bars`,
                {
                    headers: {
                        "APCA-API-KEY-ID": this.apiKey,
                        "APCA-API-SECRET-KEY": this.apiSecret,
                    },
                    params: {
                        symbols: symbol,
                        timeframe: alpacaTimeframe,
                        start: start.toISOString(),
                        end: end.toISOString(),
                        limit: 10000,
                        adjustment: "raw",
                        feed: "iex"
                    }
                }
            );
 
            const bars = response.data.bars?.[symbol] || [];

            return bars.map((bar: any) => ({
                symbol,
                timeframe,
                time: Math.floor(new Date(bar.t).getTime() / 1000), 
                open: bar.o,
                high: bar.h,
                low: bar.l,
                close: bar.c,
                volume: bar.v,
            }));
            
        } catch (error: any) {
            console.error("Alpaca API Error fetching candles:", error?.response?.data || error.message);
            throw error;
        }
    }
}
 