'use client';
import { useState } from 'react';
import {
    Search,
    Wallet,
    TrendingUp,
    Clock,
    ChevronRight,
    Filter,
} from 'lucide-react';
import { StatsCardComponent } from '@shared/components/cards/StatCardComponent';
import { useQuery } from '@tanstack/react-query';
import AssetAllocationDonut from '../components/PieChart';
import { Pagination } from '@shared/components/pagination/Pagination';
import { getPortfolioDatas, getPortfolioInvestments, getPortfolioProjection } from '@shared/services/feature/portfolio/PortfolioApi';
import type { IInvestmentBaseResponse, IPortfolioDatasResponse, IPortfolioProjectionResponse } from '@shared/types/portfolio.types';
import { formatDateTime } from '@utils/date-converter/DateConverter';
import { useNavigate } from '@tanstack/react-router';
import api from '@lib/axiosUser';

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
    if (['active', 'settled', 'credited', 'executed', 'allotted'].some(s => lower.includes(s))) {
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
    }
    if (['pending', 'processing'].some(s => lower.includes(s))) {
        return 'bg-amber-950/40 text-amber-400 border-amber-500/30';
    }
    if (['cancelled', 'rejected', 'failed'].some(s => lower.includes(s))) {
        return 'bg-rose-950/40 text-rose-500 border-rose-500/30';
    }
    return 'bg-zinc-800/50 text-zinc-400 border-zinc-700/40';
};

const getProfitStyle = (profit: number = 0) => {
    if (profit >= 0) return 'text-emerald-400';
    return 'text-rose-500';
};

const PortfolioDashboard = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const limit = 10;
    const navigate = useNavigate()

    const {
        data: holdingsData,
        isLoading: isHoldingsLoading,
        isError,
        error: queryError,
    } = useQuery<IInvestmentBaseResponse>({
        queryKey: ['portfolio', 'holdings', page, limit, status, search],
        queryFn: () => getPortfolioInvestments(page, limit, status, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev: any) => prev,
    });

    const {
        data: summaryData,
        isLoading: isSummaryLoading,
    } = useQuery<IPortfolioDatasResponse>({
        queryKey: ['portfolio', 'summary'],
        queryFn: getPortfolioDatas,
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev: any) => prev,
    });


    const { data: xirrData } = useQuery({
        queryKey: ["portfolio-key"],
        queryFn: async () => await api.get('/user/portfolio/return-xirr'),
    })

    const {
        data: projectionData,
        isLoading: isProjectionLoading,
    } = useQuery<IPortfolioProjectionResponse>({
        queryKey: ['portfolio', 'projection'],
        queryFn: getPortfolioProjection,
        staleTime: 5 * 60 * 1000,
    });

    const investments = holdingsData?.data || [];
    const totalCount = holdingsData?.totalCount ?? 0;

    const totalInvestment = summaryData?.totalInvestment ?? 0;
    const totalProfit = summaryData?.totalProfit ?? 0;
    const currentValue = summaryData?.currentValue ?? 0;
    const profitPercentage = summaryData?.profitPercentage ?? 0;
    const xirrValue = Number(xirrData?.data?.data).toFixed(2) || 0;

    const isLoading = isHoldingsLoading || isSummaryLoading;

    const handlePageChange = (newPage: number) => {
        const maxPage = Math.ceil(totalCount / limit);
        if (newPage >= 1 && newPage <= maxPage) {
            setPage(newPage);
        }
    };

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [returnType, setReturnType] = useState<'Absolute' | 'XIRR'>('Absolute');

    return (
        <div className="min-h-screen bg-black text-zinc-100 pb-10">
            <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-white tracking-tight">Portfolio</h1>
                        <p className="text-xs text-zinc-500 mt-0.5">Monitor your investments and performance metrics</p>
                    </div>

                    {/* Return Type Toggle */}
                    <div className="flex items-center bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-1">
                        <button
                            onClick={() => setReturnType('Absolute')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${returnType === 'Absolute'
                                ? 'bg-zinc-800 text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            ABSOLUTE
                        </button>
                        <button
                            onClick={() => setReturnType('XIRR')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${returnType === 'XIRR'
                                ? 'bg-zinc-800 text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            XIRR
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCardComponent
                        title="Total Invested"
                        value={totalInvestment}
                        prefix="₹"
                        subtitle="Cost basis"
                        icon={<Wallet size={20} className="text-zinc-400" strokeWidth={2} />}
                    />
                    <StatsCardComponent
                        title="Current Value"
                        value={currentValue}
                        prefix="₹"
                        subtitle="Market value"
                        icon={<TrendingUp size={20} strokeWidth={2} />}
                    />
                    <StatsCardComponent
                        title="Total Returns"
                        value={totalProfit}
                        prefix="₹"
                        subtitle={`${profitPercentage >= 0 ? '+' : ''}${profitPercentage.toFixed(2)}% absolute`}
                        color={profitPercentage >= 0 ? 'emerald' : 'rose'}
                        icon={<TrendingUp size={20} strokeWidth={2} />}
                    />
                    <StatsCardComponent
                        title="Portfolio XIRR"
                        value={xirrValue}
                        suffix="%"
                        subtitle={xirrData?.data?.data !== undefined ? "Annualised return" : "Calculation in progress..."}
                        color={xirrData?.data?.data >= 0 ? 'emerald' : xirrData?.data?.data < 0 ? 'rose' : 'zinc'}
                        icon={<TrendingUp size={20} strokeWidth={2} />}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} strokeWidth={2} />
                                <input
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Search by scheme name..."
                                    className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg pl-9 pr-3 py-2 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-950 transition-all"
                                />
                            </div>
                            <div className="relative min-w-[140px]">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} strokeWidth={2} />
                                <select
                                    value={status || ''}
                                    onChange={(e) => {
                                        setStatus(e.target.value || null);
                                        setPage(1);
                                    }}
                                    className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg pl-9 pr-8 py-2 text-xs text-zinc-300 appearance-none focus:outline-none focus:border-zinc-600 focus:bg-zinc-950 transition-all cursor-pointer"
                                >
                                    <option value="" className="bg-zinc-900">All Status</option>
                                    <option value="ALLOTTED" className="bg-zinc-900">Allotted</option>
                                    <option value="INITIATED" className="bg-zinc-900">Initiated</option>
                                    <option value="REDEEMED" className="bg-zinc-900">Redeemed</option>
                                    <option value="FAILED" className="bg-zinc-900">Failed</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg overflow-hidden">
                            <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center justify-between">
                                <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Holdings</h2>
                                <span className="text-xs text-zinc-500">
                                    {search ? investments.length : totalCount} positions
                                </span>
                            </div>

                            {isLoading ? (
                                <div className="py-12 text-center text-xs text-zinc-600">Loading investments...</div>
                            ) : isError ? (
                                <div className="py-12 text-center text-xs text-rose-500">
                                    Failed to load — {(queryError as Error)?.message || 'Unknown error'}
                                </div>
                            ) : investments.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-xs text-zinc-600">
                                        {search ? 'No matching investments found' : 'No investments yet'}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-800/50">
                                    {investments.map((inv) => {
                                        const profit = inv.profit ?? 0;
                                        const profitClass = getProfitStyle(profit);
                                        const holdingCurrentValue = (inv.amount ?? 0) + profit;
                                        const isExpanded = expandedId === (inv.id || inv.schemeCode);

                                        return (
                                            <div key={inv.id || inv.schemeCode} className="transition-all">
                                                <div
                                                    onClick={() => setExpandedId(isExpanded ? null : (inv.id || inv.schemeCode) as string)}
                                                    className={`px-4 py-3.5 hover:bg-zinc-800/40 transition-colors cursor-pointer group flex items-center justify-between gap-4 ${isExpanded ? 'bg-zinc-800/30' : ''}`}
                                                >
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
                                                        </div>
                                                    </div>

                                                    <div className="hidden sm:block text-right min-w-[100px]">
                                                        <p className="text-xs font-semibold text-zinc-200">
                                                            ₹{holdingCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-500 mt-0.5">
                                                            Current Value
                                                        </p>
                                                    </div>

                                                    <div className="text-right min-w-[120px]">
                                                        {returnType === 'Absolute' ? (
                                                            <>
                                                                <div className={`flex items-center justify-end gap-1 text-sm font-bold ${profitClass}`}>
                                                                    {profit > 0 ? '+' : profit < 0 ? '-' : ''}
                                                                    ₹{Math.abs(profit).toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                                                </div>
                                                                <p className="text-[10px] text-zinc-500 mt-0.5">
                                                                    Invested: ₹{inv.amount?.toLocaleString('en-IN') ?? '—'}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className={`flex items-center justify-end gap-1 text-sm font-bold ${inv.xirr !== undefined && inv.xirr >= 0 ? 'text-emerald-400' : inv.xirr !== undefined ? 'text-rose-500' : 'text-zinc-500'}`}>
                                                                    {inv.xirr !== undefined ? `${(inv.xirr * 100).toFixed(2)}%` : '—'}
                                                                </div>
                                                                <p className="text-[10px] text-zinc-500 mt-0.5">
                                                                    Annualised
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="hidden lg:block text-right min-w-[90px]">
                                                        <p className="text-xs font-medium text-zinc-300">
                                                            {inv.nav ? `₹${inv.nav.toFixed(2)}` : '—'}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-600 mt-0.5">
                                                            {inv.navDate ? new Date(inv.navDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'NAV'}
                                                        </p>
                                                    </div>

                                                    <ChevronRight size={14} className={`text-zinc-600 transition-all duration-300 ${isExpanded ? 'rotate-90 text-zinc-300' : 'group-hover:text-zinc-300'}`} />
                                                </div>

                                                {isExpanded && (
                                                    <div className="px-5 py-5 bg-zinc-900/40 border-t border-zinc-800/40 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Fund Details</p>
                                                                    <p className="text-xs font-bold text-white leading-relaxed">{inv.schemeName}</p>
                                                                    <p className="text-[11px] text-zinc-400 mt-0.5">{inv.category || 'Mutual Fund'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1.5">Status</p>
                                                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStatusStyle(inv.status)}`}>
                                                                        {inv.status}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Financials</p>
                                                                    <div className="flex justify-between items-center text-xs py-1 border-b border-zinc-800/50">
                                                                        <span className="text-zinc-500">Invested Amount</span>
                                                                        <span className="text-white font-medium">₹{inv.amount?.toLocaleString('en-IN')}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-xs py-1 border-b border-zinc-800/50">
                                                                        <span className="text-zinc-500">P&L (Absolute)</span>
                                                                        <span className={`font-bold ${profitClass}`}>
                                                                            {profit >= 0 ? '+' : ''}₹{Math.abs(profit).toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-xs py-1">
                                                                        <span className="text-zinc-500">Your XIRR</span>
                                                                        <span className={`font-bold ${inv.xirr !== undefined && inv.xirr >= 0 ? 'text-emerald-400' : inv.xirr !== undefined ? 'text-rose-500' : 'text-zinc-500'}`}>
                                                                            {inv.xirr !== undefined ? `${(inv.xirr * 100).toFixed(2)}%` : '—'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Holdings & NAV</p>
                                                                    <div className="flex justify-between items-center text-xs py-1 border-b border-zinc-800/50">
                                                                        <span className="text-zinc-500">Units Held</span>
                                                                        <span className="text-white font-medium">{inv.units?.toFixed(4) || '—'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-xs py-1 border-b border-zinc-800/50">
                                                                        <span className="text-zinc-500">NAV Date</span>
                                                                        <span className="text-white font-medium">
                                                                            {inv.navDate ? new Date(inv.navDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-xs py-1 border-b border-zinc-800/50">
                                                                        <span className="text-zinc-500">NAV Price</span>
                                                                        <span className="text-white font-medium">₹{inv.nav?.toFixed(2) || '—'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-xs py-1">
                                                                        <span className="text-zinc-500">Current Value</span>
                                                                        <span className="text-white font-bold">₹{holdingCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1.5">Timeline & Returns</p>
                                                                    <div className="space-y-3">
                                                                        <div>
                                                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Investment Since</p>
                                                                            <p className="text-[11px] text-zinc-200 font-medium">{formatDateTime(new Date(inv.createdAt))}</p>
                                                                            <p className="text-[10px] text-zinc-500 mt-1 italic">
                                                                                Holding for {Math.floor((Date.now() - new Date(inv.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                                                                            </p>
                                                                        </div>

                                                                        {inv.status?.toLowerCase().includes('redeemed') || (inv.redeemedUnits && inv.redeemedUnits > 0) ? (
                                                                            <div className="pt-2 border-t border-zinc-800/50">
                                                                                <p className="text-[10px] text-rose-500 uppercase font-bold mb-1">Redemption Summary</p>
                                                                                <div className="flex justify-between text-[11px]">
                                                                                    <span className="text-zinc-500">Amount</span>
                                                                                    <span className="text-rose-400 font-bold">₹{inv.redeemedAmount?.toLocaleString('en-IN') || '—'}</span>
                                                                                </div>
                                                                                <div className="flex justify-between text-[11px] mt-0.5">
                                                                                    <span className="text-zinc-500">Units</span>
                                                                                    <span className="text-zinc-400 font-medium">{inv.redeemedUnits?.toFixed(4)} units</span>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                                                                                <p className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">Active Portfolio</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
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
                                                <span className={`text-[10px] font-bold ${tx.positive ? 'text-emerald-400' : 'text-rose-500'}`}>
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

                        {/* Portfolio Projection Card */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4 overflow-hidden relative group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                                    10-Year Forecast
                                </h3>
                                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="text-[10px] text-emerald-400 font-bold">12% CAGR</span>
                                </div>
                            </div>

                            {isProjectionLoading ? (
                                <div className="py-4 text-center text-[10px] text-zinc-600">Calculating projection...</div>
                            ) : projectionData ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-medium mb-1">Projected Value</p>
                                            <p className="text-lg font-bold text-white tracking-tight">
                                                ₹{projectionData.projectedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-medium mb-1">Expected Growth</p>
                                            <p className="text-lg font-bold text-emerald-400 tracking-tight">
                                                +₹{projectionData.projectedProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-zinc-800/50">
                                        <p className="text-[9px] text-zinc-500 italic leading-relaxed">
                                            Based on your current portfolio value and a conservative 12% annual return over the next 10 years.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-2 text-center text-[10px] text-zinc-600">No data available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioDashboard;