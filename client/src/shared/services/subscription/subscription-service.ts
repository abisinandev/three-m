import adminApi from "@/lib/axios-admin";

import type {
    Plan,
    PaginatedPlans,
    PaginatedSubscriptions,
    SubscriptionStats
} from "@/shared/types/subscription/subscription.types";

export const getPlans = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean
}) => {
    const { data } = await adminApi.get("/subscriptions", { params });
    return data.data as PaginatedPlans;
};

export const getOverviewStats = async () => {
    const { data } = await adminApi.get("/subscriptions/stats");
    return data.data as SubscriptionStats;
};

export const getUserSubscriptions = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) => {
    const { data } = await adminApi.get("/subscriptions/all-subscriptions", { params });
    return data.data as PaginatedSubscriptions;
};

export const updatePlan = async (code: string, payload: Partial<Plan>) => {
    const { data: response } = await adminApi.patch(`/subscriptions/${code}`, { ...payload, code });
    return response;
};

const subscriptionService = {
    getPlans,
    getOverviewStats,
    getUserSubscriptions,
    updatePlan
};

export default subscriptionService;
