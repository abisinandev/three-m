import adminApi from '@/lib/axios-admin';
import { API_ROUTES } from '@shared/constants/apiRoutes';
import type { StockFilters } from '@shared/types/admin/stock-management.types';


export const FetchStockDataApi = async (filters: StockFilters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            params.append(key, String(value));
        }
    });

    const response = await adminApi.get(`${API_ROUTES.ADMIN.STOCKS.GET_ALL}?${params.toString()}`);
    return response.data.data;
};
