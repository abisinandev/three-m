import { useState, useMemo } from 'react';
import { format, startOfMonth } from 'date-fns';
import {
    Activity,
    Plus,
    Search,
    RefreshCcw,
    AlertCircle,
    Zap,
    TrendingDown,
    TrendingUp
} from 'lucide-react';

import { useExpenseTracker } from '../hooks/useExpenseTracker';
import { ExpenseModal } from '../components/ExpenseTracker/ExpenseModal';
import { IncomeModal } from '../components/ExpenseTracker/IncomeModal';
import { TransactionTable } from '../components/ExpenseTracker/TransactionTable';
import { AnalyticsView } from '../components/ExpenseTracker/AnalyticsView';
import { TopSummary } from '../components/ExpenseTracker/TopSummary';
import { BudgetPattern } from '../components/ExpenseTracker/BudgetPattern';
import { MonthPicker } from '../components/ExpenseTracker/MonthPicker';

import { formatCurrency, getHealthScoreColor } from '../helpers/expenseHelpers';
import { CHART_COLORS, ITEMS_PER_PAGE } from '../constants/expenseConstants';
import type { Category, InvestmentType, TransactionType } from '../contants/ExpenseTrackerTypes';
import type { Expense, Investment } from '../types/expense-types';


const ExpenseTracker = () => {
    const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
    const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const displayMonth = format(selectedMonth, 'MMMM yyyy');

    const { dashboardData, analyticsData, isDashboardLoading, isAnalyticsLoading } = useExpenseTracker(selectedMonth);

    const backendExpenses = dashboardData?.expenses || [];
    const incomeSources = dashboardData?.incomeSources || [];
    const backendInvestments = dashboardData?.investments || [];
    const totalIncome = dashboardData?.income || 0;

    const filteredExpenses = useMemo(() => {
        return backendExpenses.filter((exp: Expense) => {
            const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
            const matchesSearch = exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exp.category?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [backendExpenses, filterCategory, searchQuery]);

    const filteredInvestments = useMemo(() => {
        return backendInvestments.filter((inv: Investment) => {
            const matchesSearch = inv.schemeName?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [backendInvestments, searchQuery]);


    const filteredNeeds = filteredExpenses.filter((e: Expense) => e.type === 'NEED').reduce((sum: number, e: Expense) => sum + e.amount, 0);
    const filteredWants = filteredExpenses.filter((e: Expense) => e.type === 'WANT').reduce((sum: number, e: Expense) => sum + e.amount, 0);
    const filteredInvested = filteredInvestments.reduce((sum: number, i: Investment) => sum + i.amount, 0);
    const filteredSpent = filteredNeeds + filteredWants;

    const needsTarget = dashboardData?.needsTarget || 0.5;
    const wantsTarget = dashboardData?.wantsTarget || 0.3;
    const savingsTarget = dashboardData?.savingsTarget || 0.2;

    const currentBalance = totalIncome - filteredSpent;
    const walletBalance = dashboardData?.walletBalance || 0;
    const usagePercent = totalIncome > 0 ? (filteredSpent / totalIncome) * 100 : 0;

    const chartData = [
        { name: 'Needs', value: filteredNeeds, color: CHART_COLORS.needs },
        {
            name: 'Wants',
            value: filteredWants,
            color: (filteredWants / totalIncome) > 0.3 ? CHART_COLORS.wants.high : CHART_COLORS.wants.normal,
        },
        { name: 'Savings', value: filteredInvested, color: CHART_COLORS.savings },
    ];

    const activeChartData = chartData.filter(d => d.value > 0);
    const finalChartData = activeChartData.length > 0 ? activeChartData : [{ name: 'Empty', value: 1, color: CHART_COLORS.empty }];

    const getDynamicInsights = () => {
        const insights = [];

        if (filteredSpent > totalIncome && totalIncome > 0) {
            insights.push({
                type: 'warning',
                text: `You've exceeded your ${displayMonth} income by ${formatCurrency(filteredSpent - totalIncome)}.`
            });
        }

        const spike = analyticsData?.insights?.find((i: any) => i.type === 'warning' || i.text.includes('increase'));
        if (spike) {
            insights.push({ type: 'warning', text: spike.text });
        }


        if (filteredSpent <= totalIncome * 0.7 && totalIncome > 0) {
            insights.push({ type: 'good', text: "You are maintaining balanced spending this month." });
        }


        if (filteredInvested >= totalIncome * 0.2 && totalIncome > 0) {
            insights.push({ type: 'good', text: "Excellent! You've met your 20% savings goal." });
        }

        return insights.slice(0, 2);
    };

    const dynamicInsights = getDynamicInsights();

    const allTransactions = [
        ...filteredExpenses.map((exp: Expense, idx: number) => ({
            id: `exp-${idx}`,
            date: exp.date ? new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            category: exp.type as Category,
            description: exp.description || exp.category || 'No description',
            amount: exp.amount || 0,
            type: 'expense' as TransactionType
        })),
        ...filteredInvestments.map((inv: Investment, idx: number) => ({
            id: `inv-${idx}`,
            date: inv.date ? new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            category: 'INVESTMENT',
            description: inv.schemeName || 'Investment',
            amount: inv.amount || 0,
            type: 'investment' as TransactionType,
            investmentType: inv.type as InvestmentType
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    return (
        <div className="min-h-screen bg-black font-sans text-neutral-300 p-6 pb-24 flex justify-center">
            <div className="w-full max-w-5xl space-y-8">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-white tracking-tight">Expense tracker</h1>
                            <div className="flex bg-[#111] p-1 rounded-xl border border-neutral-800">
                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveTab('analytics')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'analytics' ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
                                >
                                    Analytics
                                </button>
                            </div>
                            {activeTab === 'analytics' && analyticsData && (
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border animate-in fade-in zoom-in duration-500 ${getHealthScoreColor(analyticsData.healthScore).bg} ${getHealthScoreColor(analyticsData.healthScore).border} ${getHealthScoreColor(analyticsData.healthScore).text}`}>
                                    <Activity size={12} />
                                    Financial Health: {analyticsData.healthScore} / 100
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-neutral-500 font-medium mt-1">Track, manage, and optimize your wealth.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Premium Month Selector */}
                        <MonthPicker
                            selectedMonth={selectedMonth}
                            setSelectedMonth={(date) => {
                                setSelectedMonth(date);
                                setCurrentPage(1);
                            }}
                            displayMonth={displayMonth}
                        />

                        {/* Smart Filters (only on dashboard) */}
                        {activeTab === 'dashboard' && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                                <div className="h-8 w-px bg-neutral-800 mx-1 hidden md:block" />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                        <Search size={14} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-[#111] text-xs text-white pl-9 pr-3 py-2 rounded-lg border border-neutral-800 focus:border-blue-500/50 outline-none transition-all w-28 md:w-40"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        setFilterCategory('All');
                                        setSearchQuery('');
                                    }}
                                    className={`p-2 rounded-lg border transition-all ${filterCategory !== 'All' || searchQuery !== '' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-[#111] border-neutral-800 text-neutral-500 hover:border-neutral-700'}`}
                                    title="Reset Filters"
                                >
                                    <RefreshCcw size={14} className={filterCategory !== 'All' || searchQuery !== '' ? 'animate-spin-slow' : ''} />
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {activeTab === 'dashboard' && (
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 animate-in fade-in duration-500">
                        {(filterCategory !== 'All' || searchQuery !== '') && (
                            <div className="text-[10px] text-blue-500 font-bold uppercase tracking-widest animate-pulse">
                                Active Filters Applied
                            </div>
                        )}
                    </div>
                )}

                {(isDashboardLoading || isAnalyticsLoading) ? (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-500 animate-pulse">
                        <Activity className="mb-4 text-neutral-700" size={48} />
                        <p className="text-sm font-medium tracking-widest uppercase">Fetching Financial Data...</p>
                    </div>
                ) : activeTab === 'dashboard' ? (
                    <>
                        {usagePercent >= 80 && (
                            <div className={`
                        animate-in slide-in-from-top duration-500
                        flex items-center gap-4 px-6 py-4 rounded-2xl border mb-6
                        ${usagePercent >= 100
                                    ? 'bg-rose-500/5 border-rose-500/20 text-rose-400 shadow-[0_4px_20px_rgba(244,63,94,0.1)]'
                                    : 'bg-amber-500/5 border-amber-500/20 text-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.1)]'}
                    `}>
                                <div className={`p-2.5 rounded-xl flex-shrink-0 ${usagePercent >= 100 ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}>
                                    <AlertCircle size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white tracking-tight">
                                        {usagePercent >= 100
                                            ? `Budget Exceeded by ${formatCurrency(filteredSpent - totalIncome)}`
                                            : 'Budget Threshold Warning'}
                                    </h4>
                                    <p className="text-xs font-medium opacity-80 mt-0.5 truncate">
                                        {usagePercent >= 100
                                            ? `You’ve exceeded your monthly budget. Consider adjusting your spending.`
                                            : `You’ve used ${Math.round(usagePercent)}% of your monthly budget.`}
                                    </p>
                                </div>
                            </div>
                        )}

                        <TopSummary
                            filteredSpent={filteredSpent}
                            walletBalance={walletBalance}
                            currentBalance={currentBalance}
                            totalIncome={totalIncome}
                            incomeSourcesCount={incomeSources.length}
                            usagePercent={usagePercent}
                            filteredSpentMinusIncome={filteredSpent - totalIncome}
                        />

                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            <BudgetPattern
                                finalChartData={finalChartData}
                                activeChartData={activeChartData}
                                filteredSpent={filteredSpent}
                                filteredInvested={filteredInvested}
                                totalIncome={totalIncome}
                                needsTarget={needsTarget}
                                wantsTarget={wantsTarget}
                                savingsTarget={savingsTarget}
                                filteredNeeds={filteredNeeds}
                                filteredWants={filteredWants}
                            />

                            {/* Actions & Insights Column */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setIsExpenseModalOpen(true)}
                                        className="group relative overflow-hidden bg-[#111] hover:bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-left transition-all"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <TrendingDown size={48} />
                                        </div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                <Plus size={18} strokeWidth={3} />
                                            </div>
                                            <span className="font-bold text-white">Add Expense</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wide pl-1">Daily Spending</p>
                                    </button>

                                    <button
                                        onClick={() => setIsIncomeModalOpen(true)}
                                        className="group relative overflow-hidden bg-[#111] hover:bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-left transition-all"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <TrendingUp size={48} />
                                        </div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                <Plus size={18} strokeWidth={3} />
                                            </div>
                                            <span className="font-bold text-white">Add Income</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wide pl-1">Salary & Bonus</p>
                                    </button>
                                </div>

                                <div className="bg-[#111] rounded-2xl p-6 border border-neutral-800/60 h-auto">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap size={16} className="text-amber-400" fill="currentColor" />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Insights & Highlights</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {dynamicInsights.length === 0 && (
                                            <p className="text-xs text-neutral-600 italic py-2">No critical insights for the current filters.</p>
                                        )}
                                        {dynamicInsights.map((insight, idx) => (
                                            <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${insight.type === 'good' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-amber-500/5 border-amber-500/10'}`}>
                                                <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 
                                            ${insight.type === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                />
                                                <p className={`text-xs leading-relaxed font-medium ${insight.type === 'good' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                    {insight.text}
                                                </p>
                                            </div>
                                        ))}
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#161616] border border-neutral-800/50">
                                            <div className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-neutral-500" />
                                            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                                                Active Income Sources: <span className="text-neutral-200">{incomeSources.length}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <TransactionTable
                            transactions={allTransactions}
                            currentPage={currentPage}
                            itemsPerPage={ITEMS_PER_PAGE}
                            totalTransactions={allTransactions.length}
                            setCurrentPage={setCurrentPage}
                            displayMonth={displayMonth}
                        />

                    </>
                ) : (
                    <AnalyticsView
                        data={analyticsData}
                        formatCurrency={formatCurrency}
                        selectedMonth={displayMonth}
                    />
                )}
            </div>

            <ExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
            />

            <IncomeModal
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                incomeSources={incomeSources}
            />
        </div>
    );
};

export default ExpenseTracker;
