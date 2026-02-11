import api from "@lib/axiosUser";
import type { MarketNews } from "@modules/user/market-news/types";
export const getMarketNews = async (params?: { query?: string; category?: string }): Promise<MarketNews[]> => {
    const response = await api.get("/market-news", { params });
    console.log('Response: ', response);
    return response?.data?.data;
};
