'use client';

import { useState } from 'react';
import {
    Search,
    Plus,
    Wallet,
    TrendingUp,
    Layers,
    DollarSign,
    Clock,
    ChevronRight,
} from 'lucide-react';
import { StatsCardComponent } from '@shared/components/cards/StatCardComponent';
import { useQuery } from '@tanstack/react-query';
import AssetAllocationDonut from '../components/PieChart';
import { Pagination } from '@shared/components/pagination/Pagination';
import { getPortfolioInvestments } from '@shared/services/feature/portfolio/PortfolioApi';
import type { IInvestmentBaseResponse } from '@shared/types/portfolio.types';
import { formatDateTime } from '@utils/date-converter/DateConverter';
import { useNavigate } from '@tanstack/react-router';

const recent = [
    {
        type: 'Buy',
        asset: 'AAPL',
        detail: '50 shares @ $175.20',
        amount: 8760,
        positive: true,
        status: 'Executed',
        time: '2h ago',
    },
];

const getStatusStyle = (status: string = '') => {
    const lower = status.toLowerCase();
    if (['active', 'settled', 'credited', 'executed'].some(s => lower.includes(s))) {
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
    }
    if (['pending', 'processing'].some(s => lower.includes(s))) {
        return 'bg-amber-950/40 text-amber-400 border-amber-500/30';
    }
    if (['cancelled', 'rejected', 'failed'].some(s => lower.includes(s))) {
        return 'bg-rose-950/40 text-rose-400 border-rose-500/30';
    }
    return 'bg-zinc-800/50 text-zinc-400 border-zinc-700/40';
};

const getProfitStyle = (profit: number = 0) => {
    if (profit > 0) return 'text-emerald-400';
    if (profit < 0) return 'text-rose-400';
    return 'text-zinc-400';
};

const PortfolioDashboard = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const limit = 10;
    const navigate = useNavigate()
    const {
        data,
        isLoading,
        isError,
        error: queryError,
    } = useQuery<IInvestmentBaseResponse>({
        queryKey: ['portfolio', page, limit],
        queryFn: () => getPortfolioInvestments(page, limit),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    });

    const investments = data?.data || [];
    const totalCount = data?.totalCount ?? 0;
    const totalInvestment = data?.totalInvestment ?? 0;
    const totalProfit = data?.totalProfit ?? 0;
    const currentValue = totalInvestment + totalProfit;
    const filteredInvestments = investments.filter((inv) =>
        inv.schemeName?.toLowerCase().includes(search.toLowerCase()) ||
        inv.schemeCode?.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = investments.filter((inv) =>
        inv.status?.toLowerCase().includes('active')
    ).length;

    const handlePageChange = (newPage: number) => {
        const maxPage = Math.ceil(totalCount / limit);
        if (newPage >= 1 && newPage <= maxPage) {
            setPage(newPage);
        }
    };

    return (
        <div className="min-h-screen bg-black text-zinc-100">
            <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-white tracking-tight">Portfolio</h1>
                        <p className="text-xs text-zinc-500 mt-0.5">Monitor your investments and performance metrics</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                        <Plus size={14} strokeWidth={2.5} />
                        Add Position
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCardComponent
                        title="Total Invested"
                        value={`₹${totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        subtitle="Cost basis"
                        icon={<Wallet size={20} className="text-zinc-400" strokeWidth={2} />}
                    />
                    <StatsCardComponent
                        title="Current Value"
                        value={currentValue}
                        formattedValue={currentValue.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                        subtitle={
                            totalProfit !== 0
                                ? `${totalProfit > 0 ? '+' : '-'}₹${Math.abs(totalProfit).toLocaleString('en-IN', {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1,
                                })} ${totalProfit > 0 ? 'gain' : 'loss'}`
                                : 'No change'
                        }
                        color={totalProfit > 0 ? 'emerald' : totalProfit < 0 ? 'rose' : 'gray'}
                        icon={<TrendingUp size={20} strokeWidth={2} />}
                    />
                    <StatsCardComponent
                        title="Total Holdings"
                        value={totalCount.toLocaleString('en-IN')}
                        subtitle={`${activeCount} active`}
                        icon={<Layers size={20} className="text-blue-400" strokeWidth={2} />}
                    />
                    <StatsCardComponent
                        title="Available Cash"
                        value="₹15,000"
                        subtitle="Ready to invest"
                        icon={<DollarSign size={20} className="text-zinc-400" strokeWidth={2} />}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} strokeWidth={2} />
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search by scheme name..."
                                className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg pl-9 pr-3 py-2.5 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-950 transition-all"
                            />
                        </div>

                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg overflow-hidden">
                            <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center justify-between">
                                <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Holdings</h2>
                                <span className="text-xs text-zinc-500">
                                    {search ? filteredInvestments.length : totalCount} positions
                                </span>
                            </div>

                            {isLoading ? (
                                <div className="py-12 text-center text-xs text-zinc-600">Loading investments...</div>
                            ) : isError ? (
                                <div className="py-12 text-center text-xs text-rose-400">
                                    Failed to load — {(queryError as Error)?.message || 'Unknown error'}
                                </div>
                            ) : filteredInvestments.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-xs text-zinc-600">
                                        {search ? 'No matching investments found' : 'No investments yet'}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-800/50">
                                    {filteredInvestments.map((inv) => {
                                        const profit = inv.profit ?? 0;
                                        const profitClass = getProfitStyle(profit);

                                        return (
                                            <div
                                                key={inv.id || inv.schemeCode}
                                                className="px-4 py-3.5 hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-9 h-9 rounded-lg bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center flex-shrink-0">
                                                            {inv.logo ? (
                                                                <img src={inv.logo} alt={inv.schemeName || ''} className="w-6 h-6 object-contain" />
                                                            ) : (
                                                                <span className="text-xs font-bold text-zinc-500">
                                                                    {inv.schemeName?.slice(0, 2).toUpperCase() || inv.schemeCode?.slice(0, 2) || '?'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-semibold text-white truncate" title={inv.schemeName}>
                                                                    {inv.schemeName || inv.schemeCode || '—'}
                                                                </p>
                                                                <span
                                                                    className={`px-1.5 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(inv.status)}`}
                                                                >
                                                                    {inv.status || 'Unknown'}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                                                                {inv.category || inv.investmentType || '—'}
                                                            </p>
                                                            <p className='text-[10px] text-zinc-600'>
                                                                Started {formatDateTime(new Date(inv.createdAt))}
                                                            </p>
                                                            <p className="text-[10px] text-zinc-600">
                                                                {inv.updatedAt
                                                                    ? `Allocated ${formatDateTime(new Date(inv.updatedAt as Date))}`
                                                                    : "Not allocated"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="hidden sm:block text-right min-w-[80px]">
                                                        <p className="text-xs font-medium text-zinc-200">
                                                            {inv.units != null ? inv.units.toFixed(2) : '—'}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-600 mt-0.5">
                                                            {inv.category || inv.investmentType || '—'}
                                                        </p>
                                                    </div>

                                                    <div className="text-right min-w-[100px]">
                                                        <p className={`text-sm font-semibold ${profitClass}`}>
                                                            {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-600 mt-0.5">
                                                            Invested: ₹{inv.amount?.toLocaleString('en-IN') ?? '—'}
                                                        </p>
                                                    </div>

                                                    <div className="hidden lg:block text-right min-w-[90px]">
                                                        <p className="text-xs font-medium text-zinc-200">
                                                            {inv.nav ? `₹${inv.nav.toFixed(2)}` : '—'}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-600 mt-0.5">
                                                            {inv.navDate ? new Date(inv.navDate).toLocaleDateString('en-IN') : 'NAV'}
                                                        </p>
                                                    </div>

                                                    <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {!search && totalCount > 0 && (
                                <Pagination
                                    page={page}
                                    limit={limit}
                                    total={totalCount}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AssetAllocationDonut investments={investments} />

                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                                    Recent Activity
                                </h3>
                                <Clock size={12} className="text-zinc-500" />
                            </div>
                            <div className="space-y-3">
                                {recent.map((tx, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800/50 last:border-0 last:pb-0"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold ${tx.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {tx.type.toUpperCase()}
                                                </span>
                                                <span className="text-xs font-semibold text-zinc-300">
                                                    {tx.asset}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-zinc-500 mt-0.5">
                                                {tx.detail}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-medium text-white">
                                                ₹{tx.amount.toLocaleString('en-IN')}
                                            </div>
                                            <div className="text-[10px] text-zinc-600">
                                                {tx.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4">
                            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                                Profit Actions
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate({ to: '/user/portfolio/redeem-profit' })}
                                    className="w-full py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-xs font-semibold rounded-lg transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                                >
                                    <TrendingUp size={14} />
                                    Redeem Profit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioDashboard;