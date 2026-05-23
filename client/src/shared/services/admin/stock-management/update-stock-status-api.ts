import adminApi from '@/lib/axios-admin';
import { API_ROUTES } from '@shared/constants/apiRoutes';

export const UpdateStockStatusApi = async (symbol: string, updates: { isTradable?: boolean; isVisible?: boolean }) => {
    const response = await adminApi.patch(API_ROUTES.ADMIN.STOCKS.UPDATE_STATUS(symbol), updates);
    return response.data;
};
