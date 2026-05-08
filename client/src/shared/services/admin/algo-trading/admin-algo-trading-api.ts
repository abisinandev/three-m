import adminApi from "@/lib/axios-admin";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { StrategyFilters, StrategyRiskConfig, AdminStrategy, AdminSignal, AdminAlgoTrade } from "@shared/types/admin/algo-trading.types";


export const FetchAdminAlgoStats = async () => {
    const response = await adminApi.get(API_ROUTES.ADMIN.ALGO_TRADING.GET_STATS, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};

export const FetchAdminStrategies = async (filters: StrategyFilters): Promise<{ data: { data: AdminStrategy[]; total: number; totalPages: number } }> => {
    const response = await adminApi.get(API_ROUTES.ADMIN.ALGO_TRADING.GET_STRATEGIES, {
        withCredentials: true,
        params: filters,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};

export const FetchAdminSignals = async (filters: StrategyFilters): Promise<{ data: { data: AdminSignal[]; total: number; totalPages: number } }> => {
    const response = await adminApi.get(API_ROUTES.ADMIN.ALGO_TRADING.GET_SIGNALS, {
        withCredentials: true,
        params: filters,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};

export const FetchAdminAlgoTrades = async (filters: StrategyFilters): Promise<{ data: { data: AdminAlgoTrade[]; total: number; totalPages: number } }> => {
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

export const UpdateAdminStrategyRiskConfig = async (data: StrategyRiskConfig) => {
    const response = await adminApi.put(`${API_ROUTES.ADMIN.ALGO_TRADING.BASE}/risk-config`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};
