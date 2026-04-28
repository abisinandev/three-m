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

export const FetchAdminAlgoTrades = async (filters: StrategyFilters) => {
    const response = await adminApi.get(API_ROUTES.ADMIN.ALGO_TRADING.GET_TRADES, {
        withCredentials: true,
        params: filters,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};

export const FetchAdminBaseStrategies = async () => {
    const response = await adminApi.get(`${API_ROUTES.ADMIN.ALGO_TRADING.BASE}/base-strategies`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};

export const UpdateAdminStrategyRiskConfig = async (data: {
    strategyName: string;
    riskAmount: number;
    maxTradesPerDay: number;
    stopLoss: number;
    takeProfit: number;
}) => {
    const response = await adminApi.put(`${API_ROUTES.ADMIN.ALGO_TRADING.BASE}/risk-config`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};
