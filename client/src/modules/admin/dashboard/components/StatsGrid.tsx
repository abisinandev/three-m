import { ArrowUpRight, ArrowDownRight, Users, CreditCard, Wallet, TrendingUp, Clock, Calendar } from 'lucide-react';
import type { AdminDashboardData } from '../types/dashboard.types';

interface StatsGridProps {
    stats: AdminDashboardData['stats'];
    formatCurrency: (val: number) => string;
}

export const StatsGrid = ({ stats, formatCurrency }: StatsGridProps) => {
    const statCards = [
        { label: 'Pending KYC', value: stats.pendingKyc.toString(), change: 'Action Required', positive: false, icon: Clock, color: 'text-yellow-500' },
        { label: 'Total Users', value: stats.totalUsers.toString(), change: 'Total Registered', positive: true, icon: Users, color: 'text-blue-500' },
        { label: 'Premium Subs', value: stats.premiumSubs.toString(), change: 'Active Subscriptions', positive: true, icon: CreditCard, color: 'text-indigo-500' },
        { label: 'Total AUM', value: formatCurrency(stats.totalAum), change: 'Assets Under Management', positive: true, icon: Wallet, color: 'text-emerald-500' },
        { label: 'Total MRR', value: formatCurrency(stats.totalMrr), change: 'Monthly Recurring Revenue', positive: true, icon: TrendingUp, color: 'text-purple-500' },
        { label: 'Active SIPs', value: stats.activeSips.toString(), change: 'Currently Running', positive: true, icon: Calendar, color: 'text-pink-500' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {statCards.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-3 hover:border-[#2a2a2a] transition-all duration-200 group"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">{stat.label}</div>
                        <stat.icon size={14} className={`${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <div className="text-lg font-bold text-gray-100">{stat.value}</div>
                    <div className={`text-[9px] mt-1.5 flex items-center gap-1 ${stat.positive ? 'text-emerald-500' : 'text-yellow-500'}`}>
                        {stat.positive ? <ArrowUpRight size={10} /> : <Clock size={10} />}
                        <span className="font-semibold">{stat.change}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
