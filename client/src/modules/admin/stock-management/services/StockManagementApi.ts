import adminApi from '@lib/axiosAdmin';
import { API_ROUTES } from '@shared/constants/apiRoutes';
import type { StockFilters } from '../types/stock-management.types';

export const StockManagementApi = {
    fetchStocks: async (filters: StockFilters) => {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    params.append(key, String(value));
                }
            });

            const response = await adminApi.get(`${API_ROUTES.ADMIN.STOCKS.GET_ALL}?${params.toString()}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    updateStockStatus: async (symbol: string, updates: Partial<{ isTradable: boolean; isVisible: boolean }>) => {
        try {
            const response = await adminApi.patch(`${API_ROUTES.ADMIN.STOCKS.UPDATE_STATUS}/${symbol}`, updates);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
