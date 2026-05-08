export interface Plan {
    id: string;
    code: string;
    price: number;
    durationInDays: number;
    features: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface PaginatedPlans {
    plans: Plan[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UserSubscription {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    planCode: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
}

export interface PaginatedSubscriptions {
    subscriptions: UserSubscription[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SubscriptionStats {
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
}
