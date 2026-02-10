import { useState } from 'react';
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
    Banknote
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { ExpenseTrackerData } from '@shared/services/feature/expense-tracker/ExpenseTrackerApi';
import { useAddExpenseMutation, useDeleteExpenseMutation, useAddIncomeMutation } from '../hooks/useExpenseMutations';
import { toast } from 'sonner';
import { Pagination } from '@shared/components/pagination/Pagination';


type TransactionType = 'expense' | 'investment';
type Category = 'NEED' | 'WANT' | 'INVESTMENT';
type InvestmentType = 'SIP' | 'MF' | 'STOCK';

interface Transaction {
    id: string;
    date: string;
    category: Category;
    description: string;
    amount: number;
    type: TransactionType;
    investmentType?: InvestmentType;
}

const ExpenseTracker = () => {
    const [selectedMonth, setSelectedMonth] = useState('January 2026');
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'NEED' | 'WANT' | ''>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [newSourceName, setNewSourceName] = useState('');
    const [newSourceAmount, setNewSourceAmount] = useState('');

    const { mutate: addExpense, isPending: isAddingExpense } = useAddExpenseMutation();
    const { mutate: deleteExpense } = useDeleteExpenseMutation();
    const { mutate: addIncome, isPending: isAddingIncome } = useAddIncomeMutation();

    const { data: DashbpardData } = useQuery({
        queryKey: ['expense-details'],
        queryFn: () => ExpenseTrackerData()
    });

    const availableMonths = ['January 2026', 'February 2026', 'March 2026'];

    const backendExpenses = DashbpardData?.expenses || [];
    const incomeSources = DashbpardData?.incomeSources || [];
    const backendInvestments = DashbpardData?.investments || [];

    const totalIncome = DashbpardData?.income || 0;
    const totalNeeds = DashbpardData?.totalNeeds || 0;
    const totalWants = DashbpardData?.totalWants || 0;
    const totalInvested = DashbpardData?.totalInvestedAmount || 0;
    const currentBalance = DashbpardData?.walletBalance || 0;

    const needsTarget = DashbpardData?.needsTarget || 0.5;
    const wantsTarget = DashbpardData?.wantsTarget || 0.3;
    const savingsTarget = DashbpardData?.savingsTarget || 0.2;

    const totalSpent = DashbpardData?.totalSpent || 0;

    const handleAddExpense = () => {
        if (!amount || !description || !category) {
            toast.error("Please fill all fields");
            return;
        }

        const expenseAmount = parseFloat(amount);
        if (expenseAmount > currentBalance) {
            toast.error("Insufficient wallet balance!");
            return;
        }

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

    const formatCurrency = (val?: number) => `₹${(val || 0).toLocaleString('en-IN')}`;

    const chartData = [
        { name: 'Needs', value: totalNeeds, color: '#3B82F6' },
        { name: 'Wants', value: totalWants, color: '#F59E0B' },
        { name: 'Savings', value: totalInvested, color: '#10B981' },
    ];

    const activeChartData = chartData.filter(d => d.value > 0);
    const finalChartData = activeChartData.length > 0 ? activeChartData : [{ name: 'Empty', value: 1, color: '#1a1a1a' }];

    const getInsights = () => {
        const insights = [];

        if (totalWants > wantsTarget) {
            insights.push({
                type: 'warning',
                text: `Wants spending is ${Math.round((totalWants / totalIncome) * 100)}%, exceeding the 30% guideline.`
            });
        } else {
            insights.push({
                type: 'good',
                text: `Wants are well within the 30% limit. Great job!`
            });
        }

        if (totalInvested < savingsTarget) {
            insights.push({
                type: 'neutral',
                text: `You need ${formatCurrency(savingsTarget - totalInvested)} more to hit your 20% savings goal.`
            });
        } else {
            insights.push({
                type: 'good',
                text: `You've met your 20% savings goal! Excellent.`
            });
        }

        return insights;
    };

    const insights = getInsights();

    const allTransactions = [
        ...backendExpenses.map((exp, idx) => ({
            id: `exp-${idx}`,
            date: exp.date ? new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            category: exp.type as Category,
            description: exp.description || exp.category || 'No description',
            amount: exp.amount || 0,
            type: 'expense' as TransactionType
        })),
        ...backendInvestments.map((inv, idx) => ({
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

    return (
        <div className="min-h-screen bg-black font-sans text-neutral-300 p-6 pb-24 flex justify-center">
            <div className="w-full max-w-5xl space-y-8">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Financial Overview</h1>
                        <p className="text-xs text-neutral-500 font-medium mt-1">Track, manage, and optimize your wealth.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#111] px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors">
                        <Calendar size={16} className="text-neutral-500" />
                        <select
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-transparent text-sm text-neutral-200 outline-none font-medium appearance-none cursor-pointer"
                        >

                            {availableMonths.map(m => <option key={m} value={m} className="bg-neutral-900">{m}</option>)}
                        </select>
                        <ChevronDown size={14} className="text-neutral-500" />
                    </div>
                </header>

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
                                <span className="text-3xl font-bold text-white tracking-tight">{formatCurrency(totalSpent)}</span>
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
                                <span className={`text-3xl font-bold tracking-tight ${currentBalance < 0 ? 'text-rose-500' : 'text-white'}`}>
                                    {formatCurrency(currentBalance)}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2 font-medium">
                                Left to spend or invest
                            </p>
                        </div>
                    </div>

                    {/* Income Card */}
                    <div className="bg-[#111] rounded-2xl p-6 border border-neutral-800/60 relative overflow-hidden group hover:border-neutral-700 transition-all">
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
                                        contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px', padding: '8px 12px' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                        formatter={(val: number | undefined) => formatCurrency(val)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Total Spent</span>
                                <span className="text-lg font-bold text-white mt-0.5">{formatCurrency(totalSpent + totalInvested)}</span>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="w-full mt-6 grid grid-cols-3 gap-2 px-2">
                            <div className="flex flex-col items-center">
                                <div className="w-full h-1 bg-blue-500/20 rounded-full mb-2 overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (totalNeeds / needsTarget) * 100)}%` }}></div>
                                </div>
                                <span className="text-[10px] text-neutral-500 uppercase font-bold">Needs</span>
                                <span className="text-xs font-bold text-blue-400">{Math.round((totalNeeds / totalIncome) * 100) || 0}%</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-full h-1 bg-amber-500/20 rounded-full mb-2 overflow-hidden">
                                    <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (totalWants / wantsTarget) * 100)}%` }}></div>
                                </div>
                                <span className="text-[10px] text-neutral-500 uppercase font-bold">Wants</span>
                                <span className="text-xs font-bold text-amber-500">{Math.round((totalWants / totalIncome) * 100) || 0}%</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-full h-1 bg-emerald-500/20 rounded-full mb-2 overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (totalInvested / savingsTarget) * 100)}%` }}></div>
                                </div>
                                <span className="text-[10px] text-neutral-500 uppercase font-bold">Savings</span>
                                <span className="text-xs font-bold text-emerald-500">{Math.round((totalInvested / totalIncome) * 100) || 0}%</span>
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
                                {insights.map((insight, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#161616] border border-neutral-800/50">
                                        <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 
                                            ${insight.type === 'good' ? 'bg-emerald-500' : insight.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}
                                        />
                                        <p className="text-xs text-neutral-300 leading-relaxed font-medium">
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
                                            No transactions yet for {selectedMonth}.
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
                                    incomeSources.map((source, idx) => (
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

export default ExpenseTracker;