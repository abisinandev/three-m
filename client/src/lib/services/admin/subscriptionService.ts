import adminApi from "@lib/axiosAdmin";

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
    userName: string;
    userEmail: string;
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
        userName: string;
        userEmail: string;
        planCode: string;
        amount: number;
        createdAt: string;
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

export const updatePlan = async (code: string, data: Partial<Plan>) => {
    const { data: response } = await adminApi.patch(`/subscriptions/${code}`, data);
    return response.data;
};

const subscriptionService = {
    getPlans,
    getOverviewStats,
    getUserSubscriptions,
    updatePlan
};

export default subscriptionService;
