import api from '@lib/axiosUser';
import { API_ROUTES } from '@shared/constants/apiRoutes';

export interface UserStockFilters {
    page?: number;
    limit?: number;
    search?: string;
    exchange?: string;
}

export const FetchUserStocksApi = async (filters: UserStockFilters) => {
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
