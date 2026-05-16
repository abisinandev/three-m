'use client';
import { useState, useMemo } from 'react';
import { format, startOfMonth } from 'date-fns';
import {
    Activity,
    Search,
    RefreshCcw,
    TrendingDown,
    TrendingUp,
    LayoutDashboard,
    PieChart as PieIcon
} from 'lucide-react';

import { useExpenseTracker } from '../hooks/useExpenseTracker';
import { ExpenseModal } from '../components/ExpenseModal';
import { IncomeModal } from '../components/IncomeModal';
import { TransactionTable } from '../components/TransactionTable';
import { AnalyticsView } from '../components/AnalyticsView';
import { TopSummary } from '../components/TopSummary';
import { BudgetPattern } from '../components/BudgetPattern';
import { MonthPicker } from '../components/MonthPicker';
import { SmartBudgetPlanner } from '../components/SmartBudgetPlanner';
import { BudgetAlerts } from '../components/BudgetAlerts';


import { formatCurrency } from '../helpers/expense-helpers';
import { CHART_COLORS } from '../constants/expense-constants';
import type { Category, TransactionType } from '../types/expense-tracker.types';
import type { Expense } from '../types/expense.types';

const ExpenseTracker = () => {
    const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
    const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');



    const { 
        dashboardData, 
        analyticsData, 
        isDashboardLoading, 
        isAnalyticsLoading,
        budgetPlanMutation 
    } = useExpenseTracker(selectedMonth);

    const incomeSources = dashboardData?.incomeSources || [];
    const totalIncome = dashboardData?.income || 0;

    const filteredExpenses = useMemo(() => {
        const expenses = dashboardData?.expenses || [];
        return expenses.filter((exp: Expense) => {
            const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
            const matchesSearch = exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exp.category?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [dashboardData?.expenses, filterCategory, searchQuery]);

    const filteredNeeds = filteredExpenses.filter((e: Expense) => e.type === 'NEED').reduce((sum: number, e: Expense) => sum + e.amount, 0);
    const filteredWants = filteredExpenses.filter((e: Expense) => e.type === 'WANT').reduce((sum: number, e: Expense) => sum + e.amount, 0);
    const filteredSavings = filteredExpenses.filter((e: Expense) => e.type === 'SAVING').reduce((sum: number, e: Expense) => sum + e.amount, 0);
    const filteredSpent = filteredNeeds + filteredWants;

    const needsTarget = dashboardData?.needsTarget || 0;
    const wantsTarget = dashboardData?.wantsTarget || 0;
    const savingsTarget = dashboardData?.savingsTarget || 0;

    const currentBalance = totalIncome - filteredSpent;
    const usagePercent = totalIncome > 0 ? (filteredSpent / totalIncome) * 100 : 0;
    const unspentBalance = Math.max(0, currentBalance - filteredSavings);

    const chartData = [
        { name: 'Needs', value: filteredNeeds, color: CHART_COLORS.needs },
        { name: 'Wants', value: filteredWants, color: (filteredWants / totalIncome) > 0.3 ? CHART_COLORS.wants.high : CHART_COLORS.wants.normal },
        { name: 'Savings', value: filteredSavings, color: CHART_COLORS.savings },
    ];


    const activeChartData = chartData.filter(d => d.value as number > 0);
    const finalChartData = activeChartData.length > 0 ? activeChartData : [{ name: 'Empty', value: 1, color: CHART_COLORS.empty }];

    const allTransactions = [
        ...filteredExpenses.map((exp: Expense, idx: number) => ({
            id: `exp-${idx}`,
            date: exp.date ? new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            category: exp.type as Category,
            description: exp.description || exp.category || 'No description',
            amount: exp.amount || 0,
            type: 'expense' as TransactionType
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] pb-12 font-sans">
            <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col gap-4">

                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-semibold text-[#e8eaed] m-0">Expense Tracker</h1>
                        <p className="text-[11px] text-[#5a5f6e] mt-0.5 m-0">Manage your 50-30-20 budget rules</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <MonthPicker
                            selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth}
                            displayMonth={format(selectedMonth, 'MMMM yyyy')}
                        />

                        <div className="flex bg-[#111214] border border-[#1e2025] rounded-md p-0.5 gap-0.5">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`px-3 py-1.5 text-[10px] font-bold rounded cursor-pointer border-none transition-all duration-150 flex items-center gap-1 ${activeTab === 'dashboard' ? 'bg-[#1e2025] text-[#e8eaed]' : 'bg-transparent text-[#5a5f6e]'}`}
                            >
                                <LayoutDashboard size={12} /> DASHBOARD
                            </button>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`px-3 py-1.5 text-[10px] font-bold rounded cursor-pointer border-none transition-all duration-150 flex items-center gap-1 ${activeTab === 'analytics' ? 'bg-[#1e2025] text-[#e8eaed]' : 'bg-transparent text-[#5a5f6e]'}`}
                            >
                                <PieIcon size={12} /> ANALYTICS
                            </button>
                        </div>
                    </div>
                </header>

                {(isDashboardLoading || isAnalyticsLoading) ? (
                    <div className="flex flex-col items-center justify-center py-15 text-[#5a5f6e]">
                        <Activity size={32} className="opacity-50 mb-3" />
                        <p className="text-[11px] font-bold tracking-wider">FETCHING ACCOUNTS...</p>
                    </div>
                ) : activeTab === 'dashboard' ? (
                    <div className="flex flex-col gap-4">

                        <BudgetAlerts
                            totalIncome={totalIncome}
                            filteredSpent={filteredSpent}
                            filteredNeeds={filteredNeeds}
                            filteredWants={filteredWants}
                            needsTarget={needsTarget}
                            wantsTarget={wantsTarget}
                        />

                        <TopSummary
                            filteredSpent={filteredSpent}
                            currentBalance={currentBalance}
                            totalIncome={totalIncome}
                            incomeSourcesCount={incomeSources.length}
                            usagePercent={usagePercent}
                            filteredSpentMinusIncome={filteredSpent - totalIncome}
                            filteredSavings={filteredSavings}
                        />

                        <div className="grid grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
                            <div className="flex flex-col gap-4">
                                <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-bold m-0 text-[#e8eaed]">TRANSACTIONS</h3>
                                        <div className="flex gap-2">
                                            <div className="relative">
                                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5a5f6e]" />
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    className="bg-[#0b0c0e] border border-[#1e2025] rounded-md text-[10px] text-white py-1.5 pr-3 pl-[30px] outline-none w-[200px]"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <button
                                                onClick={() => { setFilterCategory('All'); setSearchQuery(''); }}
                                                className="bg-transparent border border-[#1e2025] rounded-md px-2 text-[#5a5f6e] cursor-pointer"
                                            >
                                                <RefreshCcw size={12} />
                                            </button>
                                        </div>
                                    </div>

                                    <TransactionTable
                                        transactions={allTransactions}
                                        currentPage={currentPage}
                                        itemsPerPage={20}
                                        totalTransactions={allTransactions.length}
                                        setCurrentPage={setCurrentPage}
                                        displayMonth={format(selectedMonth, 'MMM yyyy')}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <BudgetPattern
                                    finalChartData={finalChartData}
                                    activeChartData={activeChartData}
                                    filteredSpent={filteredSpent}
                                    totalIncome={totalIncome}
                                    needsTarget={needsTarget}
                                    wantsTarget={wantsTarget}
                                    savingsTarget={savingsTarget}
                                    filteredNeeds={filteredNeeds}
                                    filteredWants={filteredWants}
                                    filteredSavings={filteredSavings}
                                    unspentBalance={unspentBalance}
                                />


                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setIsExpenseModalOpen(true)}
                                        className="w-full py-2.5 bg-rose-500/5 border border-rose-500/15 rounded-md text-[#F43F5E] text-[11px] font-bold cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <TrendingDown size={14} /> ADD EXPENSE
                                    </button>
                                    <button
                                        onClick={() => setIsIncomeModalOpen(true)}
                                        className="w-full py-2.5 bg-green-500/5 border border-green-500/20 rounded-md text-[#00C853] text-[11px] font-bold cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <TrendingUp size={14} /> ADD INCOME
                                    </button>
                                </div>


                            </div>
                        </div>

                        <div className="mt-8">
                            <SmartBudgetPlanner 
                                dashboardData={dashboardData} 
                                budgetPlanMutation={budgetPlanMutation}
                                month={format(selectedMonth, 'yyyy-MM')}
                            />
                        </div>
                    </div>
                ) : (
                    <AnalyticsView
                        data={analyticsData}
                        formatCurrency={formatCurrency}
                        selectedMonth={format(selectedMonth, 'MMMM yyyy')}
                    />
                )}
            </div>

            <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
            <IncomeModal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} incomeSources={incomeSources} />
        </div>
    );
};

export default ExpenseTracker;
