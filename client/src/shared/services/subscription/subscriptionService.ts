import adminApi from "@/lib/axios-admin";

export type Plan = {
    id: string;
    code: string;
    price: number;
    durationInDays: number;
    features: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
};

export type PaginatedPlans = {
    plans: Plan[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type UserSubscription = {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    planCode: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
};

export type PaginatedSubscriptions = {
    subscriptions: UserSubscription[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type SubscriptionStats = {
    totalRevenue: number;
    activeSubscriptions: number;
    totalSubscriptions: number;
    subscriptionPlans: {
        code: string;
        count: number;
        percentage: number;
    }[];
    recentSubscribers: {
        fullName: string;
        email: string;
        planCode: string;
        amount: number;
        createdAt: string;
    }[];
    monthlyGrowth: {
        month: string;
        revenue: number;
        subscriptions: number;
    }[];
};

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
