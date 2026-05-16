import api from '@/lib/axios-user';
import { API_ROUTES } from '@shared/constants/apiRoutes';
import type { Stock } from '@shared/components/interfaces/IStockTable';

export interface UserStockFilters {
    page?: number;
    limit?: number;
    search?: string;
    exchange?: string;
    sort?: string;
}

export interface StockListResponse {
    success: boolean;
    message: string;
    data: {
        data: Stock[];
        total: number;
    };
}

export const FetchUserStocksApi = async (filters: UserStockFilters): Promise<StockListResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            params.append(key, String(value));
        }
    });

    const response = await api.get(`${API_ROUTES.USER.STOCKS.GET_ALL}?${params.toString()}`);
    return response.data;
};
 
export const FetchMarketMoversApi = async (): Promise<{ success: boolean, data: { gainers: Stock[], losers: Stock[] } }> => {
    const response = await api.get(API_ROUTES.USER.STOCKS.MARKET_MOVERS);
    return response.data;
};
