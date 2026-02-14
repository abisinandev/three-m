import { TrendingDown, Wallet, TrendingUp, Banknote } from 'lucide-react';
import { formatCurrency } from '@modules/user/helpers/expenseHelpers';

interface TopSummaryProps {
    filteredSpent: number;
    walletBalance: number;
    currentBalance: number;
    totalIncome: number;
    incomeSourcesCount: number;
    usagePercent: number;
    filteredSpentMinusIncome: number;
}

export const TopSummary = ({
    filteredSpent,
    walletBalance,
    currentBalance,
    totalIncome,
    incomeSourcesCount,
    usagePercent,
    filteredSpentMinusIncome
}: TopSummaryProps) => {

    return (
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
                        <span className={`text-3xl font-bold tracking-tight ${walletBalance < 0 ? 'text-rose-500' : 'text-white'}`}>
                            {Number(walletBalance).toFixed(2)}
                        </span>
                    </div>
                    <p className={`text-xs mt-2 font-bold ${walletBalance < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {currentBalance < 0
                            ? `Remaining Budget: -${walletBalance}`
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
                        Across {incomeSourcesCount} active sources
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
                                Exceeded by {formatCurrency(filteredSpentMinusIncome)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
