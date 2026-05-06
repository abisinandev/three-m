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