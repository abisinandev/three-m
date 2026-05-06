export interface AdminDashboardData {
    stats: {
        pendingKyc: number;
        totalUsers: number;
        premiumSubs: number;
        totalAum: number;
        totalMrr: number;
        activeSips: number;
    };
    charts: {
        userGrowth: { month: string; users: number; premium: number }[];
        cashFlow: { week: string; deposits: number; withdrawals: number }[];
        investmentDistribution: { mf: number; stocks: number; algo: number };
    };
    recentTransactions: {
        id: string;
        user: string;
        amount: number;
        type: string;
        status: string;
        time: string;
    }[];
}
