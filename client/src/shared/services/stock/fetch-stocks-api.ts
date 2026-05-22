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

export interface OrderHistoryItem {
    id: string;
    userId: string;
    symbol: string;
    name: string;
    logo?: string;
    exchange: string;
    side: string;
    orderType: string;
    quantity: number;
    price: number;
    limitPrice: number | null;
    stopLoss: number | null;
    takeProfit: number | null;
    status: string;
    filledQty: number;
    executedPrice: number | null;
    createdAt: string;
    updatedAt: string;
    executedAt: string | null;
    isAlgoTrade: boolean;
}

export interface OrderHistoryResponse {
    success: boolean;
    message: string;
    data: {
        orders: OrderHistoryItem[];
        total: number;
    };
}

export const FetchUserOrderHistoryApi = async (page: number, limit: number): Promise<OrderHistoryResponse> => {
    const response = await api.get(`${API_ROUTES.USER.STOCKS.ORDER_HISTORY}?page=${page}&limit=${limit}`);
    return response.data;
};
