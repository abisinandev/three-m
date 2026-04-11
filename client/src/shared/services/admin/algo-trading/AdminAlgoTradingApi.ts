import adminApi from "@lib/axiosAdmin";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export type StrategyFilters = {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export const FetchAdminAlgoStats = async () => {
    const response = await adminApi.get(API_ROUTES.ADMIN.ALGO_TRADING.GET_STATS, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};

export const FetchAdminStrategies = async (filters: StrategyFilters) => {
    const response = await adminApi.get(API_ROUTES.ADMIN.ALGO_TRADING.GET_STRATEGIES, {
        withCredentials: true,
        params: filters,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};

export const FetchAdminSignals = async (filters: StrategyFilters) => {
    const response = await adminApi.get(API_ROUTES.ADMIN.ALGO_TRADING.GET_SIGNALS, {
        withCredentials: true,
        params: filters,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};
