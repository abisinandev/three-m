import { useState, useMemo, useRef, useEffect } from 'react';
import { format, startOfMonth, addMonths, subMonths, setMonth as setDateMonth, setYear as setDateYear, getYear, getMonth } from 'date-fns';
import {
    Plus,
    Trash2,
    Lock,
    Zap,
    Wallet,
    Calendar,
    ChevronDown,
    X,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Banknote,
    BarChart3,
    Activity,
    ArrowUpRight,
    ArrowDownLeft,
    Lightbulb,
    Target,
    RefreshCcw,
    Search
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { ExpenseTrackerData, FetchAnalyticsData } from '@shared/services/feature/expense-tracker/ExpenseTrackerApi';
import { useAddExpenseMutation, useDeleteExpenseMutation, useAddIncomeMutation } from '../hooks/useExpenseMutations';
import { toast } from 'sonner';
import { Pagination } from '@shared/components/pagination/Pagination';
import type { Category, InvestmentType, TransactionType } from '../contants/ExpenseTrackerTypes';


const ExpenseTracker = () => {
    const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
    const [pickerYear, setPickerYear] = useState(getYear(selectedMonth));
    const monthPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
                setIsMonthPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'NEED' | 'WANT' | ''>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [newSourceName, setNewSourceName] = useState('');
    const [newSourceAmount, setNewSourceAmount] = useState('');

    const { mutate: addExpense, isPending: isAddingExpense } = useAddExpenseMutation();
    const { mutate: deleteExpense } = useDeleteExpenseMutation();
    const { mutate: addIncome, isPending: isAddingIncome } = useAddIncomeMutation();

    const apiMonth = format(selectedMonth, 'yyyy-MM');
    const displayMonth = format(selectedMonth, 'MMMM yyyy');

    const { data: DashboardData, isLoading: isDashboardLoading } = useQuery({
        queryKey: ['expense-details', apiMonth],
        queryFn: () => ExpenseTrackerData(apiMonth)
    });

    const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
        queryKey: ['expense-analytics', apiMonth],
        queryFn: () => FetchAnalyticsData(apiMonth),
        enabled: activeTab === 'analytics' || !!DashboardData
    });

    const analyticsData = analytics?.data;

    const backendExpenses = DashboardData?.expenses || [];
    const incomeSources = DashboardData?.incomeSources || [];
    const backendInvestments = DashboardData?.investments || [];

    const filteredExpenses = useMemo(() => {
        return backendExpenses.filter(exp => {
            const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
            const matchesSearch = exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exp.category?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [backendExpenses, filterCategory, searchQuery]);

    const filteredInvestments = useMemo(() => {
        return backendInvestments.filter(inv => {
            const matchesSearch = inv.schemeName?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [backendInvestments, searchQuery]);

    const totalIncome = DashboardData?.income || 0;

    const filteredNeeds = filteredExpenses.filter(e => e.type === 'NEED').reduce((sum, e) => sum + e.amount, 0);
    const filteredWants = filteredExpenses.filter(e => e.type === 'WANT').reduce((sum, e) => sum + e.amount, 0);
    const filteredInvested = filteredInvestments.reduce((sum, i) => sum + i.amount, 0);
    const filteredSpent = filteredNeeds + filteredWants;

    const needsTarget = DashboardData?.needsTarget || 0.5;
    const wantsTarget = DashboardData?.wantsTarget || 0.3;
    const savingsTarget = DashboardData?.savingsTarget || 0.2;

    const currentBalance = totalIncome - filteredSpent;
    const walletBalanace = DashboardData?.walletBalance
    const usagePercent = totalIncome > 0 ? (filteredSpent / totalIncome) * 100 : 0;

    const formatCurrency = (val?: number) => `₹${(val || 0).toLocaleString('en-IN')}`;

    const chartData = [
        { name: 'Needs', value: filteredNeeds, color: '#3B82F6' },
        {
            name: 'Wants',
            value: filteredWants,
            color: (filteredWants / totalIncome) > 0.3 ? '#EF4444' : '#F59E0B',
        },
        { name: 'Savings', value: filteredInvested, color: '#10B981' },
    ];

    const activeChartData = chartData.filter(d => d.value > 0);
    const finalChartData = activeChartData.length > 0 ? activeChartData : [{ name: 'Empty', value: 1, color: '#1a1a1a' }];

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
        ...filteredExpenses.map((exp, idx) => ({
            id: `exp-${idx}`,
            date: exp.date ? new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            category: exp.type as Category,
            description: exp.description || exp.category || 'No description',
            amount: exp.amount || 0,
            type: 'expense' as TransactionType
        })),
        ...filteredInvestments.map((inv, idx) => ({
            id: `inv-${idx}`,
            date: inv.date ? new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            category: 'INVESTMENT',
            description: inv.schemeName || 'Investment',
            amount: inv.amount || 0,
            type: 'investment' as TransactionType,
            investmentType: inv.type as InvestmentType
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalTransactions = allTransactions.length;
    const currentTransactions = allTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAddExpense = () => {
        if (!amount || !description || !category) {
            toast.error("Please fill all fields");
            return;
        }

        const expenseAmount = parseFloat(amount);
        addExpense({
            amount: expenseAmount,
            category: description,
            type: category as 'NEED' | 'WANT',
            description: description,
            date: date || undefined
        }, {
            onSuccess: () => {
                setAmount('');
                setDescription('');
                setCategory('');
                setDate(new Date().toISOString().split('T')[0]);
                setIsExpenseModalOpen(false);
                toast.success("Expense added successfully");
            }
        });
    };

    const handleAddIncomeSource = () => {
        if (!newSourceName || !newSourceAmount) {
            toast.error("Please fill all fields");
            return;
        }

        addIncome({
            source: newSourceName,
            amount: parseFloat(newSourceAmount)
        }, {
            onSuccess: () => {
                setNewSourceName('');
                setNewSourceAmount('');
                setIsIncomeModalOpen(false);
                toast.success("Income source added");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (id.startsWith('exp-')) {
            const index = parseInt(id.split('-')[1]);
            if (!isNaN(index)) {
                deleteExpense(index);
            }
        }
    };

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
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border animate-in fade-in zoom-in duration-500 ${analyticsData.healthScore >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    analyticsData.healthScore >= 60 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                        'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                    }`}>
                                    <Activity size={12} />
                                    Financial Health: {analyticsData.healthScore} / 100
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-neutral-500 font-medium mt-1">Track, manage, and optimize your wealth.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Premium Month Selector */}
                        <div className="relative" ref={monthPickerRef}>
                            <button
                                onClick={() => {
                                    setIsMonthPickerOpen(!isMonthPickerOpen);
                                    setPickerYear(getYear(selectedMonth));
                                }}
                                className="flex items-center gap-2 bg-[#111] px-4 py-2 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300 shadow-sm group"
                            >
                                <Calendar size={16} className="text-neutral-500 group-hover:text-blue-500 transition-colors" />
                                <span className="text-sm text-neutral-200 font-bold tracking-tight">{displayMonth}</span>
                                <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-300 ${isMonthPickerOpen ? 'rotate-180 text-blue-500' : ''}`} />
                            </button>

                            {isMonthPickerOpen && (
                                <div className="absolute top-full right-0 mt-3 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-72 animate-in fade-in zoom-in duration-200 origin-top-right">
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <button
                                            onClick={() => setPickerYear(prev => prev - 1)}
                                            className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <ChevronDown className="rotate-90" size={16} />
                                        </button>
                                        <span className="text-sm font-black text-white tracking-widest">{pickerYear}</span>
                                        <button
                                            onClick={() => setPickerYear(prev => prev + 1)}
                                            className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <ChevronDown className="-rotate-90" size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Array.from({ length: 12 }).map((_, i) => {
                                            const monthDate = new Date(pickerYear, i, 1);
                                            const isSelected = getYear(selectedMonth) === pickerYear && getMonth(selectedMonth) === i;
                                            const isCurrentMonth = getYear(new Date()) === pickerYear && getMonth(new Date()) === i;

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedMonth(monthDate);
                                                        setIsMonthPickerOpen(false);
                                                        setCurrentPage(1);
                                                    }}
                                                    className={`
                                                        py-2.5 rounded-xl text-xs font-bold transition-all duration-200
                                                        ${isSelected
                                                            ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105 z-10'
                                                            : 'text-neutral-500 hover:bg-neutral-800/80 hover:text-neutral-200'}
                                                        ${isCurrentMonth && !isSelected ? 'border border-blue-500/30 text-blue-400' : ''}
                                                    `}
                                                >
                                                    {format(monthDate, 'MMM')}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-neutral-800/50 flex justify-center">
                                        <button
                                            onClick={() => {
                                                setSelectedMonth(startOfMonth(new Date()));
                                                setIsMonthPickerOpen(false);
                                                setCurrentPage(1);
                                            }}
                                            className="text-[10px] font-black uppercase tracking-widest text-blue-500/80 hover:text-blue-400 transition-colors"
                                        >
                                            Go to Current Month
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

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
                        {/* <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] rounded-full border border-neutral-800">
                            <Filter size={12} className="text-neutral-500" />
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mr-1">Category:</span>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="bg-transparent text-xs text-neutral-200 outline-none font-bold cursor-pointer"
                            >
                                <option value="All" className="bg-neutral-900">All Categories</option>
                                <option value="Food" className="bg-neutral-900">Food</option>
                                <option value="Rent" className="bg-neutral-900">Rent</option>
                                <option value="Bills" className="bg-neutral-900">Bills</option>
                                <option value="Shopping" className="bg-neutral-900">Shopping</option>
                                <option value="Travel" className="bg-neutral-900">Travel</option>
                                <option value="Health" className="bg-neutral-900">Health</option>
                                <option value="Other" className="bg-neutral-900">Other</option>
                            </select>
                        </div> */}

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

                        {/* Top Summary Cards */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Total Spent Card */}
                            <div className="bg-[#111] rounded-2xl p-6 border border-neutral-800/60 relative overflow-hidden group hover:border-neutral-700 transition-all">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <TrendingDown size={80} className="text-rose-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-rose-500/10 rounded-md text-rose-500">
                                            <TrendingDown size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Total Spent</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white tracking-tight">{formatCurrency(filteredSpent)}</span>
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-2 font-medium">
                                        Total expenses for the month
                                    </p>
                                </div>
                            </div>

                            {/* Wallet Card */}
                            <div className="bg-[#111] rounded-2xl p-6 border border-neutral-800/60 relative overflow-hidden group hover:border-neutral-700 transition-all">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Wallet size={80} className="text-emerald-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-500">
                                            <Wallet size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Wallet Balance</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-3xl font-bold tracking-tight ${walletBalanace as number < 0 ? 'text-rose-500' : 'text-white'}`}>
                                            {walletBalanace}
                                        </span>
                                    </div>
                                    <p className={`text-xs mt-2 font-bold ${walletBalanace as number < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {currentBalance < 0
                                            ? `Remaining Budget: -${walletBalanace}`
                                            : "You are on track this month."}
                                    </p>
                                </div>
                            </div>

                            {/* Income Card */}
                            <div className={`rounded-2xl p-6 border transition-all duration-500 relative overflow-hidden group ${usagePercent >= 100 ? 'bg-rose-500/5 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]' : 'bg-[#111] border-neutral-800/60 hover:border-neutral-700'}`}>
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Banknote size={80} className="text-blue-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-500">
                                            <TrendingUp size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Monthly Income</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white tracking-tight">{formatCurrency(totalIncome)}</span>
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-2 font-medium">
                                        Across {incomeSources.length} active sources
                                    </p>

                                    {/* Budget Progress Bar */}
                                    <div className="mt-5 space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-neutral-500">Budget Usage</span>
                                            <span className={usagePercent >= 100 ? 'text-rose-500' : usagePercent >= 70 ? 'text-amber-500' : 'text-emerald-500'}>
                                                {Math.round(usagePercent)}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ease-out rounded-full ${usagePercent >= 100 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                                                    usagePercent >= 70 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' :
                                                        'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                                    }`}
                                                style={{ width: `${Math.min(100, usagePercent)}%` }}
                                            ></div>
                                        </div>
                                        {usagePercent > 100 && (
                                            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight text-right animate-pulse mt-2">
                                                Exceeded by {formatCurrency(filteredSpent - totalIncome)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* 50-30-20 Chart Section */}
                            <div className="lg:col-span-1 bg-[#111] rounded-2xl p-6 border border-neutral-800/60 flex flex-col items-center justify-center relative min-h-[300px]">
                                <h3 className="absolute top-6 left-6 text-sm font-bold text-white uppercase tracking-wide">
                                    Budget Distribution
                                </h3>
                                <div className="absolute top-6 right-6 text-[10px] font-bold bg-neutral-800/50 px-2 py-1 rounded text-neutral-400 border border-neutral-700">
                                    50-30-20 Rule
                                </div>

                                <div className="w-full h-56 relative mt-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={finalChartData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                                cornerRadius={4}
                                            >
                                                {activeChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                                {activeChartData.length === 0 && <Cell fill="#1a1a1a" />}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '12px', padding: '12px', border: '1px solid #222' }}
                                                itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                                                cursor={{ fill: 'transparent' }}
                                                formatter={(val: any, name?: string) => {
                                                    return [formatCurrency(val), name || ''];
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center Text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Filtered Spend</span>
                                        <span className="text-lg font-bold text-white mt-0.5">{formatCurrency(filteredSpent + filteredInvested)}</span>
                                    </div>
                                </div>

                                {/* Custom Legend */}
                                <div className="w-full mt-6 grid grid-cols-3 gap-2 px-2">
                                    <div className="flex flex-col items-center">
                                        <div className="w-full h-1 bg-blue-500/20 rounded-full mb-2 overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (filteredNeeds / (totalIncome * (needsTarget || 0.5))) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-[10px] text-neutral-500 uppercase font-bold">Needs</span>
                                        <span className="text-xs font-bold text-blue-400">{Math.round((filteredNeeds / totalIncome) * 100) || 0}%</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-full h-1 bg-amber-500/20 rounded-full mb-2 overflow-hidden">
                                            <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (filteredWants / (totalIncome * (wantsTarget || 0.3))) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-[10px] text-neutral-500 uppercase font-bold">Wants</span>
                                        <span className="text-xs font-bold text-amber-500">{Math.round((filteredWants / totalIncome) * 100) || 0}%</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-full h-1 bg-emerald-500/20 rounded-full mb-2 overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (filteredInvested / (totalIncome * (savingsTarget || 0.2))) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-[10px] text-neutral-500 uppercase font-bold">Savings</span>
                                        <span className="text-xs font-bold text-emerald-500">{Math.round((filteredInvested / totalIncome) * 100) || 0}%</span>
                                    </div>
                                </div>
                            </div>

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

                        <section className="bg-[#111] rounded-2xl border border-neutral-800/60 overflow-hidden">
                            <div className="p-6 border-b border-neutral-800/60 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                                    Transactions History
                                </h3>
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wilder">
                                    {allTransactions.length} Records
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#161616]">
                                        <tr className="text-left text-[10px] font-bold text-neutral-500 tracking-widest uppercase">
                                            <th className="py-4 pl-6">Date</th>
                                            <th className="py-4">Category</th>
                                            <th className="py-4">Description</th>
                                            <th className="py-4 text-right">Amount</th>
                                            <th className="py-4 text-center pr-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800/50">
                                        {allTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-neutral-600 text-xs italic">
                                                    No transactions yet for {displayMonth}.
                                                </td>
                                            </tr>
                                        ) : (
                                            currentTransactions.map((tx) => (
                                                <tr key={tx.id} className="group hover:bg-[#161616] transition-colors text-xs font-medium text-neutral-300">

                                                    <td className="py-4 pl-6 font-mono text-neutral-500">{tx.date}</td>
                                                    <td className="py-4">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase ${tx.category === 'NEED' ? 'bg-blue-500/10 text-blue-400' :
                                                            tx.category === 'WANT' ? 'bg-amber-500/10 text-amber-500' :
                                                                'bg-emerald-500/10 text-emerald-400'
                                                            }`}>
                                                            {tx.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-white">
                                                        {tx.description}
                                                        {'investmentType' in tx && tx.investmentType && (
                                                            <span className="ml-2 text-[9px] text-neutral-500 border border-neutral-800 px-1 py-0.5 rounded">{tx.investmentType}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 text-right font-bold tabular-nums">
                                                        {formatCurrency(tx.amount)}
                                                    </td>
                                                    <td className="py-4 text-center pr-4">
                                                        {tx.type === 'expense' ? (
                                                            <button
                                                                onClick={() => handleDelete(tx.id)}
                                                                className="p-2 rounded-md hover:bg-rose-500/10 text-neutral-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        ) : (
                                                            <Lock size={12} className="mx-auto text-neutral-600 opacity-0 group-hover:opacity-50" />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                page={currentPage}
                                limit={itemsPerPage}
                                total={totalTransactions}
                                onPageChange={setCurrentPage}
                            />
                        </section>

                    </>
                ) : (
                    <AnalyticsView
                        data={analyticsData}
                        formatCurrency={formatCurrency}
                        selectedMonth={displayMonth}
                    />
                )}
            </div>

            {/* EXPENSE MODAL */}
            {isExpenseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111] border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="bg-emerald-500/10 p-1.5 rounded text-emerald-500"><Plus size={18} /></span> Add Expense
                            </h2>
                            <button onClick={() => setIsExpenseModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Description</label>
                                <input
                                    type="text"
                                    placeholder="What did you buy?"
                                    className="w-full bg-[#1a1a1a] text-sm text-white px-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder-neutral-600"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-sans">₹</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-[#1a1a1a] text-sm text-white pl-8 pr-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
                                            value={amount}
                                            onChange={e => setAmount(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Category</label>
                                    <select
                                        className="w-full bg-[#1a1a1a] text-sm text-white px-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
                                        value={category}
                                        onChange={e => setCategory(e.target.value as any)}
                                    >
                                        <option value="" disabled>Select</option>
                                        <option value="NEED">🔹 Needs</option>
                                        <option value="WANT">🔸 Wants</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-[#1a1a1a] text-sm text-white px-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleAddExpense}
                                disabled={isAddingExpense}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAddingExpense ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : 'Save Transaction'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* INCOME MODAL */}
            {isIncomeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111] border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="bg-blue-500/10 p-1.5 rounded text-blue-500"><Plus size={18} /></span> Add Income Source
                            </h2>
                            <button onClick={() => setIsIncomeModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Source Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Freelance, Salary"
                                    className="w-full bg-[#1a1a1a] text-sm text-white px-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-neutral-600"
                                    value={newSourceName}
                                    onChange={e => setNewSourceName(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-sans">₹</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full bg-[#1a1a1a] text-sm text-white pl-8 pr-4 py-3 rounded-xl border border-neutral-800 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                                        value={newSourceAmount}
                                        onChange={e => setNewSourceAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddIncomeSource}
                                disabled={isAddingIncome}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAddingIncome ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : 'Add Income Source'}
                            </button>
                        </div>

                        <div className="mt-6 pt-4 border-t border-neutral-800">
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">Current Sources</p>
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                                {incomeSources.length === 0 ? (
                                    <p className="text-xs text-neutral-600 italic">No income sources added yet.</p>
                                ) : (
                                    incomeSources.map((source: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between text-xs bg-[#1a1a1a] p-2.5 rounded-lg border border-neutral-800">
                                            <span className="text-neutral-300 font-medium">{source.source}</span>
                                            <span className="font-mono text-neutral-400">{formatCurrency(source.amount)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

const AnalyticsView = ({ data, formatCurrency, selectedMonth }: { data: any, formatCurrency: (val?: number) => string, selectedMonth: string }) => {
    const [viewType, setViewType] = useState<'monthly' | 'daily'>('monthly');

    if (!data) return (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <Activity className="animate-pulse mb-4 text-neutral-700" size={48} />
            <p className="text-sm font-medium">Analyzing your financial data...</p>
        </div>
    );

    const { comparison, categoryComparison, spendingTrend, insights, healthScore } = data;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Monthly Comparison Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <TrendingUp size={64} />
                    </div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">{selectedMonth}</p>
                    <div className="flex items-baseline gap-2 relative z-10">
                        <h3 className="text-2xl font-black text-white">{formatCurrency(comparison.thisMonth)}</h3>
                        {comparison.percentageChange !== 0 && (
                            <div className={`flex items-center text-[10px] font-bold ${comparison.difference > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {comparison.difference > 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                {Math.abs(Math.round(comparison.percentageChange))}%
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 shadow-xl relative overflow-hidden group">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Previous Month</p>
                    <h3 className="text-2xl font-bold text-neutral-400">{formatCurrency(comparison.lastMonth)}</h3>
                </div>

                <div className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden ${comparison.difference > 0 ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-sans">Net Change</p>
                    <h3 className={`text-2xl font-black ${comparison.difference > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {comparison.difference > 0 ? '+' : '-'}{formatCurrency(Math.abs(comparison.difference))}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Insights Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* View Toggle */}
                    <div className="bg-[#111] p-1.5 rounded-xl border border-neutral-800 flex w-fit">
                        <button
                            onClick={() => setViewType('monthly')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewType === 'monthly' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Month Comparison
                        </button>
                        <button
                            onClick={() => setViewType('daily')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewType === 'daily' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Daily Trend
                        </button>
                    </div>

                    <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 min-h-[400px]">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{viewType === 'monthly' ? 'Top Category Comparison' : 'Daily Spending Trend'}</h3>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Data-driven spending breakdown</p>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {viewType === 'monthly' ? (
                                    <BarChart data={categoryComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="name" stroke="#555" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#555" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                                        <Tooltip
                                            cursor={{ fill: '#333', opacity: 0.1 }}
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                                        />
                                        <Bar dataKey="thisMonth" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} name="This Month" />
                                        <Bar dataKey="lastMonth" fill="#222" radius={[4, 4, 0, 0]} barSize={20} name="Last Month" />
                                    </BarChart>
                                ) : (
                                    <LineChart data={spendingTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="day" stroke="#555" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#555" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                                        />
                                        <Line type="monotone" dataKey="thisMonth" stroke="#3B82F6" strokeWidth={3} dot={false} name="This Month" />
                                        <Line type="monotone" dataKey="lastMonth" stroke="#444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Last Month" />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Intelligent Insights Section */}
                <div className="space-y-6">
                    <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <Lightbulb size={18} className="text-amber-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Smart Insights</h3>
                        </div>

                        <div className="space-y-4">
                            {insights.length === 0 && (
                                <p className="text-xs text-neutral-600 italic">No significant trends detected this month.</p>
                            )}
                            {insights.map((insight: any, idx: number) => (
                                <div key={idx} className={`p-4 rounded-xl border flex gap-3 items-start transition-all hover:translate-x-1 ${insight.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' :
                                    insight.type === 'warning' ? 'bg-rose-500/5 border-rose-500/10' :
                                        'bg-blue-500/5 border-blue-500/10'
                                    }`}>
                                    <div className="mt-1">
                                        {insight.type === 'success' ? <TrendingDown size={14} className="text-emerald-500" /> :
                                            insight.type === 'warning' ? <AlertCircle size={14} className="text-rose-500" /> :
                                                <Activity size={14} className="text-blue-500" />}
                                    </div>
                                    <p className={`text-xs font-semibold leading-relaxed ${insight.type === 'success' ? 'text-emerald-400' :
                                        insight.type === 'warning' ? 'text-rose-400' :
                                            'text-blue-400'
                                        }`}>
                                        {insight.text}
                                    </p>
                                </div>
                            ))}

                            {/* Health Meter Hook */}
                            <div className="mt-8 pt-6 border-t border-neutral-800">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Health Score</h4>
                                        <p className="text-xl font-black text-white">{healthScore}%</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${healthScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' : healthScore >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        style={{ width: `${healthScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;
