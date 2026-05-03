import api from '@lib/axiosUser';
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
    try {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, String(value));
            }
        });

        const response = await api.get(`${API_ROUTES.USER.STOCKS.GET_ALL}?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
 
export const FetchMarketMoversApi = async (): Promise<{ success: boolean, data: { gainers: Stock[], losers: Stock[] } }> => {
    try {
        const response = await api.get(`${API_ROUTES.USER.STOCKS.GET_ALL}/market/movers`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


