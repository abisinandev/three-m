import api from '@/lib/axios-user';
import { API_ROUTES } from '@shared/constants/apiRoutes';
import type { Stock } from '@shared/components/interfaces/IStockTable';

export interface WatchlistResponse {
    success: boolean;
    message: string;
    data: Stock[];
}

export const FetchWatchlistApi = async (): Promise<WatchlistResponse> => {
    const response = await api.get(API_ROUTES.USER.STOCKS.WATCHLIST);
    return response.data;
};

export const AddToWatchlistApi = async (symbol: string): Promise<WatchlistResponse> => {
    const response = await api.post(API_ROUTES.USER.STOCKS.WATCHLIST, { symbol });
    return response.data;
};

export const RemoveFromWatchlistApi = async (symbol: string): Promise<WatchlistResponse> => {
    const response = await api.delete(API_ROUTES.USER.STOCKS.WATCHLIST, { data: { symbol } });
    return response.data;
};
