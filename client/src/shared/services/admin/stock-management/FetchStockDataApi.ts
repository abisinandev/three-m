import adminApi from '@lib/axiosAdmin';
import { API_ROUTES } from '@shared/constants/apiRoutes';

export interface StockFilters {
    page?: number;
    limit?: number;
    search?: string;
    exchange?: string;
    isTradable?: boolean | string;
    isTracked?: boolean | string;
    isVisible?: boolean | string;
}

export const FetchStockDataApi = async (filters: StockFilters) => {
    try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, String(value));
            }
        });

        const response = await adminApi.get(`${API_ROUTES.ADMIN.STOCKS.GET_ALL}?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
