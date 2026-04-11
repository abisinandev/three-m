import adminApi from '@lib/axiosAdmin';
import { API_ROUTES } from '@shared/constants/apiRoutes';

export const UpdateStockStatusApi = async (symbol: string, updates: { isTradable?: boolean; isTracked?: boolean; isVisible?: boolean }) => {
    try {
        const response = await adminApi.patch(API_ROUTES.ADMIN.STOCKS.UPDATE_STATUS(symbol), updates);
        return response.data;
    } catch (error) {
        throw error;
    }
};
