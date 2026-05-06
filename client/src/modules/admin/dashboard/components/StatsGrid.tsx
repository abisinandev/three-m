import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { AdminDashboardData } from '../../types/dashboard.types';

interface StatsGridProps {
    stats: AdminDashboardData['stats'];
    formatCurrency: (val: number) => string;
}

export const StatsGrid = ({ stats, formatCurrency }: StatsGridProps) => {
    const statCards = [
        { label: 'Pending KYC', value: stats.pendingKyc.toString(), change: 'Action Required', positive: false },
        { label: 'Total Users', value: stats.totalUsers.toString(), change: 'Total Registered', positive: true },
        { label: 'Premium Subs', value: stats.premiumSubs.toString(), change: 'Active Subscriptions', positive: true },
        { label: 'Total AUM', value: formatCurrency(stats.totalAum), change: 'Assets Under Management', positive: true },
        { label: 'Total MRR', value: formatCurrency(stats.totalMrr), change: 'Monthly Recurring Revenue', positive: true },
        { label: 'Active SIPs', value: stats.activeSips.toString(), change: 'Currently Running', positive: true },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {statCards.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-3 hover:border-[#2a2a2a] transition-all duration-200"
                >
                    <div className="text-gray-500 text-[10px] uppercase font-medium tracking-wider">{stat.label}</div>
                    <div className="text-lg font-bold mt-1 text-gray-100">{stat.value}</div>
                    <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${stat.positive ? 'text-emerald-500' : 'text-red-400'}`}>
                        {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        <span className="font-medium">{stat.change}</span>
                        <span className="text-gray-600">from last week</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
