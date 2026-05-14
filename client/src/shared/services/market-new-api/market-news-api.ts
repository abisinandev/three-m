import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { MarketNewsResponse } from "@modules/user/market-news/types";

export const getMarketNews = async (params?: { 
    query?: string; 
    category?: string; 
    page?: number; 
    pageSize?: number;
}): Promise<MarketNewsResponse> => {
    const response = await api.get(API_ROUTES.USER.MARKET_NEWS.GET_ALL, { params });
    return response?.data?.data;
};
