import { CashFlowChart } from '../components/CashFlowChart';
import { DashboardWidgets } from '../components/DashboardWidgets';
import { InvestmentDistributionDonut } from '../components/InvestmentDistributionDonut';
import { RecentTransactions } from '../components/RecentTransactions';
import { StatsGrid } from '../components/StatsGrid';
import { UserGrowthChart } from '../components/UserGrowthChart';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const AdminDashboard = () => {
    const { data, isLoading } = useAdminDashboard();

    if (isLoading || !data) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-48 bg-[#1f1f1f] rounded animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-24 bg-[#0f0f0f] border border-[#1f1f1f] rounded-md animate-pulse" />
                    ))}
                </div>
                <div className="h-64 bg-[#0f0f0f] border border-[#1f1f1f] rounded-md animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                    <h1 className="text-xl font-bold text-gray-100 tracking-tight">Admin Overview</h1>
                    <p className="text-[11px] text-gray-500 font-medium">Monitoring platform performance and user activity</p>
                </div>
                <div className="px-3 py-1.5 bg-[#0f0f0f] border border-[#1f1f1f] rounded text-[10px] text-gray-400 font-medium">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <StatsGrid stats={data.stats} formatCurrency={formatCurrency} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <UserGrowthChart data={data.charts.userGrowth} />
                    <CashFlowChart data={data.charts.cashFlow} />
                </div>
                <InvestmentDistributionDonut 
                    data={data.charts.investmentDistribution} 
                    totalAum={data.stats.totalAum} 
                    formatCurrency={formatCurrency} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <RecentTransactions data={data.recentTransactions} formatCurrency={formatCurrency} />
                <DashboardWidgets />
            </div>
        </div>
    );
};

export default AdminDashboard;