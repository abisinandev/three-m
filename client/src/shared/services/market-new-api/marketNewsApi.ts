import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { MarketNews } from "@modules/user/market-news/types";
export const getMarketNews = async (params?: { query?: string; category?: string }): Promise<MarketNews[]> => {
    const response = await api.get(API_ROUTES.USER.MARKET_NEWS.GET_ALL, { params });
    console.log('Response: ', response);
    return response?.data?.data;
};
