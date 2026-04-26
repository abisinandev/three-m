import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { UserGrowthChart } from '../components/dashboard/UserGrowthChart';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';
import { InvestmentDistributionDonut } from '../components/dashboard/InvestmentDistributionDonut';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { DashboardWidgets } from '../components/dashboard/DashboardWidgets';

const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const AdminDashboard = () => {
    const { data, isLoading } = useAdminDashboard();

    if (isLoading || !data) {
        return <div className="p-6 text-gray-400 text-sm animate-pulse">Loading dashboard metrics...</div>;
    }

    return (
        <div className="space-y-4">
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