import adminApi from '@/lib/axios-admin';
import { API_ROUTES } from '@shared/constants/apiRoutes';
import type { Stock, StockFilters } from '../types/stock-management.types';

export const StockManagementApi = {
    fetchStocks: async (filters: StockFilters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, String(value));
            }
        });

        const response = await adminApi.get(`${API_ROUTES.ADMIN.STOCKS.GET_ALL}?${params.toString()}`);
        return response.data.data;
    },

    updateStockStatus: async (symbol: string, updates: Partial<{ isTradable: boolean; isVisible: boolean }>) => {
        const response = await adminApi.patch(API_ROUTES.ADMIN.STOCKS.UPDATE_STATUS(symbol), updates);
        return response.data;
    },

    searchStocks: async (query: string) => {
        const response = await adminApi.get(`${API_ROUTES.ADMIN.STOCKS.SEARCH}?q=${encodeURIComponent(query)}`);
        return response.data.data;
    },

    addStock: async (stock: Omit<Stock, '_id' | 'createdAt' | 'updatedAt'>) => {
        const response = await adminApi.post(API_ROUTES.ADMIN.STOCKS.ADD, stock);
        return response.data;
    }
};
