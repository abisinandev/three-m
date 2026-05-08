import api from '@lib/axiosUser';
import { API_ROUTES } from '@shared/constants/apiRoutes';
import type { MarketDataCandles } from '@shared/types/external/market-data.types';


class MarketDataService {
    async getHistoricalCandles(symbol: string, resolution: string, from: number, to: number): Promise<MarketDataCandles> {
        const params = new URLSearchParams({
            resolution,
            from: String(from),
            to: String(to)
        });

        const response = await api.get(`${API_ROUTES.USER.STOCKS.GET_ALL}/${symbol}/candles?${params.toString()}`);
        return response.data?.data || response.data; 
    }

    async getQuote(symbol: string) {
        const response = await api.get(`${API_ROUTES.USER.STOCKS.GET_ALL}/${symbol}`);
        return response.data?.data || response.data;
    }
}

export const marketDataService = new MarketDataService();
export default marketDataService;
