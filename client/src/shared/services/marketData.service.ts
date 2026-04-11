import api from '@lib/axiosUser';
import { API_ROUTES } from '@shared/constants/apiRoutes';

export interface MarketDataCandles {
    s: 'ok' | 'no_data';
    t: number[];
    o: number[];
    h: number[];
    l: number[];
    c: number[];
    v: number[];
}

class MarketDataService {
    async getHistoricalCandles(symbol: string, resolution: string, from: number, to: number): Promise<MarketDataCandles> {
        const params = new URLSearchParams({
            resolution,
            from: String(from),
            to: String(to)
        });

        // Utilizes the updated controller that forwards to Yahoo for Indian stocks
        const response = await api.get(`${API_ROUTES.USER.STOCKS.GET_ALL}/${symbol}/candles?${params.toString()}`);
        return response.data?.data || response.data; // Accommodate standard API response structure
    }

    async getQuote(symbol: string) {
        const response = await api.get(`${API_ROUTES.USER.STOCKS.GET_ALL}/${symbol}`);
        return response.data?.data || response.data;
    }
}

export const marketDataService = new MarketDataService();
export default marketDataService;
