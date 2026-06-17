import { PremiumUpgradeCard, VerificationAlertCard } from '@shared/components/cards/AlertCard';
import { useUserStore } from '@stores/user/UserStore';
import {
    Wallet, TrendingDown, ArrowUpRight, ArrowDownRight,
    BarChart3, Activity, Zap, PieChart, TrendingUp
} from 'lucide-react';
import { usePremiumModalStore } from '@stores/user/PremiumModalStore';
import { useDashboard } from '../hooks/useDashboard';

import { Skeleton } from '../components/Skeleton';
import { PortfolioLineChart } from '../components/PortfolioLineChart';
import { ExpenseDonut } from '../components/ExpenseDonut';
import { ActiveSipsPanel } from '../components/ActiveSipsPanel';
import { RecentInvestmentsPanel } from '../components/RecentInvestmentsPanel';
import { formatCompact, formatCurrency } from '../../helpers/format';

const DashboardPage = () => {
    const user = useUserStore((state) => state.user);
    const { onOpen: openPremiumModal } = usePremiumModalStore();
    const { data, isLoading } = useDashboard();

    const walletBalance = data?.wallet?.balance ?? 0;
    const totalExpenses = data?.expense?.totalExpenses ?? 0;
    const totalMfInvest = data?.totalMutualFundInvestment ?? 0;
    const stockHoldings = data?.portfolio?.stockHoldingsCount ?? 0;
    const netSavings = data?.expense?.netSavings ?? 0;
    const totalIncome = data?.expense?.totalIncome ?? 0;
    const needsSpent = data?.expense?.needsSpent ?? 0;
    const wantsSpent = data?.expense?.wantsSpent ?? 0;
    const savingsSpent = data?.expense?.savingsSpent ?? 0;
    const portfolioGrowth = data?.portfolioGrowth ?? [];
    const totalStockValue = data?.portfolio?.totalInvestedAmount ?? 0;
    const recentSips = data?.recentSips ?? [];
    const recentInvestments = data?.recentInvestments ?? [];

    const statsRows = [
        {
            icon: Wallet, label: 'Wallet Balance',
            value: formatCurrency(walletBalance),
            change: walletBalance > 0 ? 'Available funds' : 'No funds',
            isPositive: walletBalance >= 0,
        },
        {
            icon: TrendingDown, label: 'Monthly Spend',
            value: formatCurrency(totalExpenses),
            change: totalIncome > 0 ? `Income ₹${(totalIncome / 1000).toFixed(0)}K` : 'This month',
            isPositive: false,
        },
        {
            icon: BarChart3, label: 'MF Investment',
            value: formatCurrency(totalMfInvest),
            change: `${stockHoldings} stock holding${stockHoldings !== 1 ? 's' : ''}`,
            isPositive: true,
        },
        {
            icon: Activity, label: 'Net Savings',
            value: formatCurrency(netSavings),
            change: netSavings >= 0 ? 'Surplus' : 'Deficit',
            isPositive: netSavings >= 0,
        },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0b0c0e',
            color: '#e8eaed',
            paddingBottom: 48,
        }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 className="text-2xl font-semibold text-[#e8eaed] tracking-tight m-0">
                            Dashboard
                        </h1>
                        <p className="text-sm text-[#5a5f6e] mt-1 m-0">
                            Overview & summary
                        </p>
                    </div>
                </div>

                {!user?.isVerified && <VerificationAlertCard />}
                {user?.isVerified && !user?.isSubscribed && (
                    <PremiumUpgradeCard onUpgrade={openPremiumModal} />
                )}
                {user?.isSubscribed && (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-md p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center">
                                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#e8eaed]">Premium Intelligence Active</p>
                                <p className="text-xs text-[#5a5f6e] uppercase tracking-wider font-medium mt-0.5">
                                    Full access to advanced trading & analytics
                                </p>
                            </div>
                        </div>
                        <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-500 uppercase tracking-wide">
                            Verified
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {statsRows.map((stat, i) => (
                        <div
                            key={i}
                            style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }}
                            className="p-4 hover:border-[#2a2a2a] transition-colors flex flex-col justify-between h-24"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <stat.icon className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                </div>
                                {stat.isPositive
                                    ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                    : <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                                }
                            </div>
                            <div>
                                {isLoading
                                    ? <><Skeleton className="h-4 w-24 mb-1.5" /><Skeleton className="h-2.5 w-16" /></>
                                    : (
                                        <>
                                            <p className="text-2xl font-bold text-gray-100 tracking-tight tabular-nums">{stat.value}</p>
                                            <p className={`text-xs mt-1 font-medium ${stat.isPositive ? 'text-emerald-500/90' : 'text-red-500/90'}`}>
                                                {stat.change}
                                            </p>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                    {/* Expense Breakdown */}
                    <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-5 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                                    Expense Breakdown
                                </h3>
                            </div>
                            <span className="text-xs text-gray-500 font-medium bg-[#1a1a1a] px-2 py-0.5 rounded">
                                This Month
                            </span>
                        </div>
                        <ExpenseDonut
                            totalExpenses={totalExpenses}
                            needsSpent={needsSpent}
                            wantsSpent={wantsSpent}
                            savingsSpent={savingsSpent}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Portfolio Growth */}
                    <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-5 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                                    Portfolio Growth
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isLoading && totalStockValue > 0 && (
                                    <span className="text-xs text-gray-400 font-medium tabular-nums">
                                        Stocks: {formatCompact(totalStockValue)}
                                    </span>
                                )}
                                <span className="text-xs text-gray-500 font-medium bg-[#1a1a1a] px-2 py-0.5 rounded">
                                    Last 6 Months
                                </span>
                            </div>
                        </div>
                        <PortfolioLineChart data={portfolioGrowth} isLoading={isLoading} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <ActiveSipsPanel recentSips={recentSips} isLoading={isLoading} />
                    <RecentInvestmentsPanel recentInvestments={recentInvestments} isLoading={isLoading} />
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;

