import api from '@/lib/axios-user';
import { API_ROUTES } from '@shared/constants/apiRoutes';

export interface FinnhubQuote {
    c: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
}

export interface FinnhubCandles {
    s: 'ok' | 'no_data';
    t: number[];
    o: number[];
    h: number[];
    l: number[];
    c: number[];
    v: number[];
}

class FinnhubService {
    async getStockDetails(symbol: string) {
        const response = await api.get(API_ROUTES.USER.STOCKS.DETAILS(symbol));
        return response.data;
    }

    async getStockCandles(symbol: string, resolution: string, from: number, to: number) {
        const params = new URLSearchParams({
            resolution,
            from: String(from),
            to: String(to)
        });

        const response = await api.get(`${API_ROUTES.USER.STOCKS.CANDLES(symbol)}?${params.toString()}`);
        return response.data;
    }
}

export const finnhubService = new FinnhubService();
export default finnhubService;
