import { useState } from 'react';
import {
    Plus,
    Trash2,
    Lock,
    Zap,
    Wallet,
    Calendar,
    ChevronDown,
    Edit2,
    X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { ExpenseTrackerData } from '@shared/services/feature/expense-tracker/ExpenseTrackerApi';
import { useAddExpenseMutation, useDeleteExpenseMutation, useAddIncomeMutation } from '../hooks/useExpenseMutations';
import { toast } from 'sonner';

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
    const { mutate: addExpense, isPending: isAddingExpense } = useAddExpenseMutation();
    const { mutate: deleteExpense } = useDeleteExpenseMutation();
    const { mutate: addIncome } = useAddIncomeMutation();

    const availableMonths = [
        'January 2026', 'February 2026', 'March 2026'
    ];

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'NEED' | 'WANT' | ''>('');
    const [date, setDate] = useState('');


    const [isManagingIncome, setIsManagingIncome] = useState(false);
    const [newSourceName, setNewSourceName] = useState('');
    const [newSourceAmount, setNewSourceAmount] = useState('');

    const { data: DashbpardData } = useQuery({
        queryKey: ['expense-details'],
        queryFn: () => ExpenseTrackerData()
    });

    const backendExpenses = DashbpardData?.expenses || [];
    const incomeSources = DashbpardData?.incomeSources || [];
    const backendInvestments = DashbpardData?.investments || [];

    const totalIncome = DashbpardData?.income || 0;
    const needsTarget = DashbpardData?.needsTarget || 0;
    const wantsTarget = DashbpardData?.wantsTarget || 0;
    const savingsTarget = DashbpardData?.savingsTarget || 0;

    const totalNeeds = DashbpardData?.totalNeeds || 0;
    const totalWants = DashbpardData?.totalWants || 0;
    const totalInvested = DashbpardData?.totalInvestedAmount || 0;

    const totalSpent = DashbpardData?.totalSpent || 0;
    const currentBalance = DashbpardData?.currentMonthBalance || 0;

    const savingsGap = DashbpardData?.savingsGap || 0;
    const isSavingsGoalMet = DashbpardData?.isSavingsGoalMet || false;

    const handleAddExpense = () => {
        if (!amount || !description || !category) return;

        const expenseAmount = parseFloat(amount);
        if (expenseAmount > currentBalance) {
            toast.success("Insufficient funds to add this expense.");
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
                setDate('');
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

    const handleAddIncomeSource = () => {
        if (!newSourceName || !newSourceAmount) return;

        const newSource = {
            name: newSourceName,
            amount: parseFloat(newSourceAmount)
        };

        addIncome({
            source: newSource.name,
            amount: newSource.amount
        });

        setNewSourceName('');
        setNewSourceAmount('');
    };

    const handleDeleteIncomeSource = (id: string) => {
        // Implement delete income logic here if needed
        console.log("Delete income not implemented yet", id);
    };


    // Map backend expenses to transaction format for display
    const expenseTransactions: Transaction[] = backendExpenses.map((exp, idx) => ({
        id: `exp-${idx}`,
        date: exp.date ? new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
        category: exp.type as Category,
        description: exp.description || exp.category || 'No description',
        amount: exp.amount || 0,
        type: 'expense' as TransactionType
    }));

    const investmentTransactions: Transaction[] = backendInvestments.map((inv, idx) => ({
        id: `inv-${idx}`,
        date: inv.date ? new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
        category: 'INVESTMENT',
        description: inv.schemeName || 'Investment',
        amount: inv.amount || 0,
        type: 'investment' as TransactionType,
        investmentType: inv.type as InvestmentType
    }));

    const allTransactions = [...expenseTransactions, ...investmentTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const formatCurrency = (val?: number) => `₹${(val || 0).toLocaleString('en-IN')}`;

    const getChartData = (used: number, total: number) => {
        const remaining = Math.max(0, total - used);
        return [
            { name: 'Used', value: used },
            { name: 'Remaining', value: remaining }
        ];
    };

    const DonutChart = ({ data, color, title, subtext, status }: { data: any[], color: string, title: string, subtext: string, status: 'good' | 'bad' | 'neutral' }) => {
        const percentage = Math.min(100, Math.round((data[0].value / (data[0].value + data[1].value)) * 100)) || 0;

        return (
            <div className="flex flex-col items-center justify-center relative">
                <div className="h-28 w-28 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={35}
                                outerRadius={48}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                                startAngle={90}
                                endAngle={-270}
                            >
                                <Cell fill={color} />
                                <Cell fill="#1a1a1a" />
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '6px', fontSize: '12px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number | undefined) => formatCurrency(value)}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <span className="text-xl font-bold">{percentage}%</span>
                    </div>
                </div>

                <p className="text-[10px] font-bold text-neutral-400 mt-2 text-center uppercase tracking-wider">{title}</p>
                <div className={`mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border
                    ${status === 'good' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        status === 'bad' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'good' ? 'bg-emerald-500' : status === 'bad' ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                    {subtext}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black font-sans text-neutral-300 p-4 pb-24 flex justify-center">
            <div className="w-full max-w-5xl space-y-6">

                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-lg font-bold text-white uppercase tracking-widest">
                        Expense Tracker
                    </h1>
                    <div className="relative">
                        <div className="flex items-center gap-2 bg-[#111] px-3 py-1.5 rounded-lg border border-neutral-800">
                            <Calendar size={18} className="text-neutral-500" />
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="bg-transparent text-xs text-white outline-none font-medium appearance-none min-w-[110px] cursor-pointer"
                            >
                                {availableMonths.map(m => <option key={m} value={m} className="bg-neutral-900 text-neutral-200">{m}</option>)}
                            </select>
                            <ChevronDown size={14} className="text-neutral-500" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <section className="bg-[#111] rounded-xl p-5 border border-neutral-800">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-2">
                                    Monthly Income <span className="bg-blue-500/10 text-[9px] px-1.5 py-0.5 rounded text-blue-400 border border-blue-500/20">Planning</span>
                                </h3>
                                <p className="text-[10px] text-neutral-500 mt-1 font-medium">Auto-sum from {incomeSources.length} sources.</p>
                            </div>
                            <button
                                onClick={() => setIsManagingIncome(!isManagingIncome)}
                                className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1.5 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-colors flex items-center gap-1.5"
                            >
                                <Edit2 size={12} /> Manage
                            </button>
                        </div>

                        {isManagingIncome ? (
                            <div className="mt-4 bg-[#1a1a1a] p-3 rounded-lg border border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                                    <h4 className="text-[10px] uppercase font-bold text-neutral-400">Income Sources</h4>
                                    <button onClick={() => setIsManagingIncome(false)}><X size={14} className="text-neutral-500 hover:text-white" /></button>
                                </div>

                                <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                                    <div className="flex items-center justify-between text-xs bg-[#111] p-2 rounded border border-neutral-800">
                                        <span className="text-white">Total Current Income</span>
                                        <span className="font-mono text-neutral-400">{formatCurrency(DashbpardData?.income || 0)}</span>
                                    </div>
                                    {incomeSources.map((source, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs bg-[#1a1a1a] p-2 rounded border border-dashed border-neutral-800 hover:border-neutral-600 transition-colors">
                                            <span className="text-neutral-400 font-medium">{source.source}</span>
                                            <span className="font-mono text-neutral-300">{formatCurrency(source.amount)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 items-center">
                                    <input
                                        placeholder="Source (e.g. Salary)"
                                        className="bg-[#111] text-xs px-2 py-1.5 rounded border border-neutral-800 w-full outline-none focus:border-blue-500"
                                        value={newSourceName}
                                        onChange={e => setNewSourceName(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        className="bg-[#111] text-xs px-2 py-1.5 rounded border border-neutral-800 w-24 outline-none focus:border-blue-500"
                                        value={newSourceAmount}
                                        onChange={e => setNewSourceAmount(e.target.value)}
                                    />
                                    <button onClick={handleAddIncomeSource} className="bg-blue-600 p-1.5 rounded text-white hover:bg-blue-500"><Plus size={14} /></button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col mt-3 border-b border-neutral-800 pb-2">
                                <span className={`text-3xl font-bold tracking-tight ${currentBalance < 0 ? 'text-rose-500' : 'text-white'}`}>
                                    {formatCurrency(currentBalance)}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Initial:</span>
                                    <span className="text-xs font-mono text-neutral-400">{formatCurrency(totalIncome)}</span>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="bg-[#111] rounded-xl p-5 border border-neutral-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Wallet size={56} className="text-white" />
                        </div>
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div>
                                <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wide flex items-center gap-2">
                                    Wallet Balance <span className="bg-emerald-500/10 text-[9px] px-1.5 py-0.5 rounded text-emerald-400 border border-emerald-500/20">Real Cash</span>
                                </h3>
                                <p className="text-[10px] text-neutral-500 mt-1 font-medium">Available for investments.</p>
                            </div>
                        </div>
                        <div className="mt-3 relative z-10">
                            <span className="text-4xl font-bold text-white tracking-tight">₹{DashbpardData?.walletBalance}</span>
                        </div>
                    </section>
                </div>

                <section className="bg-[#111] rounded-xl p-5 border border-neutral-800">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-xs font-bold text-white uppercase tracking-wide border-l-4 border-emerald-500 pl-3">
                            Budget Breakdown
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <DonutChart
                            data={getChartData(totalNeeds, needsTarget)}
                            color="#3B82F6"
                            title="Needs (50%)"
                            subtext={`${Math.round((totalNeeds / needsTarget) * 100) || 0}% Used`}
                            status={totalNeeds > needsTarget ? 'bad' : 'good'}
                        />
                        <DonutChart
                            data={getChartData(totalWants, wantsTarget)}
                            color="#F59E0B"
                            title="Wants (30%)"
                            subtext={`${Math.round((totalWants / wantsTarget) * 100) || 0}% Used`}
                            status={totalWants > wantsTarget ? 'bad' : 'good'}
                        />
                        <DonutChart
                            data={getChartData(totalInvested, savingsTarget)}
                            color="#10B981"
                            title="Savings (20%)"
                            subtext={`${Math.round((totalInvested / savingsTarget) * 100) || 0}% Met`}
                            status={isSavingsGoalMet ? 'good' : 'neutral'}
                        />
                    </div>
                </section>
                {/* 
                <section className="bg-[#111] rounded-xl p-5 border border-neutral-800">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-wide flex items-center gap-2">
                            <TrendingUp size={18} /> Investment Summary
                        </h2>
                        {isSavingsGoalMet ? (
                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 tracking-wide">
                                GOAL MET
                            </span>
                        ) : (
                            <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 flex items-center gap-1 tracking-wide">
                                <Zap size={10} fill="currentColor" /> {formatCurrency(savingsGap)} SHORT
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-neutral-800">
                            <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">SIP Invested</p>
                            <p className="text-base font-bold text-white mt-1">{formatCurrency(DashbpardData?.sipInvestedAmount || 0)}</p>
                        </div>
                        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-neutral-800">
                            <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Mutual Funds</p>
                            <p className="text-base font-bold text-white mt-1">{formatCurrency(DashbpardData?.mutualFundInvestedAmount || 0)}</p>
                        </div>
                        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-neutral-800">
                            <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Stocks</p>
                            <p className="text-base font-bold text-white mt-1">{formatCurrency(DashbpardData?.stocks || 0)}</p>
                        </div>
                        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-emerald-500/20">
                            <p className="text-[9px] text-emerald-500 uppercase font-bold tracking-wider">Total Invested</p>
                            <p className="text-base font-bold text-emerald-400 mt-1">{formatCurrency(DashbpardData?.totalInvestedAmount || 0)}</p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="flex justify-between text-[10px] text-neutral-400 mb-1.5 font-bold uppercase tracking-wide">
                            <span>Progress to Goal ({formatCurrency(savingsTarget)})</span>
                            <span className={isSavingsGoalMet ? 'text-emerald-500' : 'text-blue-500'}>{Math.round((totalInvested / savingsTarget) * 100) || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${isSavingsGoalMet ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(100, (totalInvested / savingsTarget) * 100)}%` }}
                            />
                        </div>
                    </div>
                </section> */}

                <section className="bg-[#111] rounded-xl p-5 border border-neutral-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-500/10 rounded-full p-2 text-emerald-500 border border-emerald-500/20">
                            <Plus size={18} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wide">Log Expense</h3>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide">Needs & Wants Only</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-[#1a1a1a] p-3 rounded-lg border border-neutral-800">
                        <div className="md:col-span-3">
                            <input
                                type="text"
                                placeholder="Description"
                                className="w-full bg-[#111] text-xs font-medium text-white px-3 py-3 rounded border border-neutral-700 outline-none focus:border-emerald-500 transition-all placeholder-neutral-600 h-10"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <input
                                type="number"
                                placeholder="Amount"
                                className="w-full bg-[#111] text-xs font-medium text-white px-3 py-3 rounded border border-neutral-700 outline-none focus:border-emerald-500 transition-all placeholder-neutral-600 h-10"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <select
                                className="w-full bg-[#111] text-xs font-medium text-neutral-300 px-3 py-3 rounded border border-neutral-700 outline-none focus:border-emerald-500 h-10 cursor-pointer appearance-none"
                                value={category}
                                onChange={e => setCategory(e.target.value as any)}
                            >
                                <option value="" disabled>Select Type</option>
                                <option value="NEED">🔹 NEED (Necessary)</option>
                                <option value="WANT">🔸 WANT (Lifestyle)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <input
                                type="date"
                                className="w-full bg-[#111] text-xs font-medium text-neutral-300 px-3 py-3 rounded border border-neutral-700 outline-none focus:border-emerald-500 h-10"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                onClick={handleAddExpense}
                                disabled={isAddingExpense}
                                className={`w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 rounded transition-all active:scale-95 text-xs uppercase tracking-wide flex items-center justify-center gap-2 ${isAddingExpense ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isAddingExpense ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Plus size={14} strokeWidth={3} />
                                )}
                                {isAddingExpense ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </div>
                </section>

                <section className="bg-[#111] rounded-xl p-5 border border-neutral-800 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wide border-l-4 border-emerald-500 pl-3">Transactions History</h3>
                        <span className="text-[9px] font-bold text-neutral-400 bg-[#1a1a1a] px-2.5 py-1 rounded border border-neutral-800 uppercase tracking-wider">
                            {selectedMonth}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-[10px] font-bold text-neutral-500 border-b border-neutral-800 tracking-widest uppercase">
                                    <th className="pb-3 pl-3">Date</th>
                                    <th className="pb-3">Type</th>
                                    <th className="pb-3">Description</th>
                                    <th className="pb-3 text-right">Amount</th>
                                    <th className="pb-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs font-medium">
                                {allTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-neutral-600 text-xs italic">
                                            No transactions found for {selectedMonth}.
                                        </td>
                                    </tr>
                                ) : (
                                    allTransactions.map((tx) => (
                                        <tr key={tx.id} className="group hover:bg-[#1a1a1a] transition-colors border-b border-neutral-800 last:border-0 text-neutral-300">
                                            <td className="py-3.5 pl-3 font-mono text-[10px] text-neutral-500 group-hover:text-neutral-400">{tx.date}</td>
                                            <td className="py-3.5">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold border tracking-wide ${tx.category === 'NEED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    tx.category === 'WANT' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    }`}>
                                                    {tx.category}
                                                </span>
                                            </td>
                                            <td className="py-3.5 text-neutral-200">
                                                {tx.description}
                                                {'investmentType' in tx && tx.investmentType && (
                                                    <span className="ml-2 text-[9px] font-bold text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/10">{tx.investmentType}</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 text-right font-bold text-white tracking-wide">
                                                {formatCurrency(tx.amount)}
                                            </td>
                                            <td className="py-3.5 text-center">
                                                {tx.type === 'expense' ? (
                                                    <button
                                                        onClick={() => handleDelete(tx.id)}
                                                        className="p-1.5 rounded hover:bg-rose-500/10 text-neutral-600 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                ) : (
                                                    <span className="text-[9px] text-neutral-500 flex justify-center items-center gap-1.5 font-bold">
                                                        <Lock size={10} className="text-emerald-500/50" /> AUTO
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {!isSavingsGoalMet && (
                        <div className="bg-[#111] p-4 rounded-xl border border-rose-500/20 flex items-center gap-4">
                            <div className="bg-rose-500/10 p-3 rounded-full text-rose-500 flex-shrink-0 border border-rose-500/20"><Zap size={20} /></div>
                            <div>
                                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">Goal Alert</p>
                                <p className="text-xs text-neutral-400 mt-1 font-medium">
                                    You are <span className="text-rose-400 font-bold">{formatCurrency(savingsGap)}</span> short of your 20% savings target.
                                </p>
                            </div>
                        </div>
                    )}
                    {totalWants > wantsTarget && (
                        <div className="bg-[#111] p-4 rounded-xl border border-amber-500/20 flex items-center gap-4">
                            <div className="bg-amber-500/10 p-3 rounded-full text-amber-500 flex-shrink-0 border border-amber-500/20"><Lock size={20} /></div>
                            <div>
                                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wide">Overspending Alert</p>
                                <p className="text-xs text-neutral-400 mt-1 font-medium">
                                    Wants exceeded 30%. Limit: <span className="text-amber-500 font-bold">{formatCurrency(wantsTarget)}</span>.
                                </p>
                            </div>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
};

export default ExpenseTracker;