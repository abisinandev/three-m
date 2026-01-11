'use client';
import { useState, useMemo } from 'react';
import {
    TrendingUp,
    Search,
    Plus,
    Wallet,
    BarChart3,
    Layers,
    CalendarCheck,
    History,
    Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { FUND_FILTERS } from '../contants/mutualFundContants';
import { toggleFundFilter } from '../helper/ToggleFilter';
import { fetchMutualFunds } from '@shared/services/feature/mutual-fund/MutualFundApisUserSide';
import { useNavigate } from '@tanstack/react-router';

const StatCard = ({ title, value, subtitle, icon, colorClass }: any) => (
    <div className={`bg-[#111] border border-[#1f1f1f] rounded-xl p-4 ${colorClass}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-400">{title}</p>
                <p className="text-xl font-semibold text-white mt-0.5">{value}</p>
            </div>
            <div className="opacity-80">{icon}</div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
);

const MutualFundDashboard = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['All Funds']);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 400);
    const navigate = useNavigate();

    const queryKey = useMemo(
        () => ['user-funds-list', debouncedSearch, selectedFilters],
        [debouncedSearch, selectedFilters]
    );

    const { data: funds = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => fetchMutualFunds(debouncedSearch, selectedFilters),
        placeholderData: (prev) => prev,
    });

    const portfolioAllocation = [
        { name: 'Equity', value: 65, color: '#3B82F6' },
        { name: 'Debt', value: 25, color: '#10B981' },
        { name: 'Gold/Others', value: 10, color: '#F59E0B' },
    ];

    const recentTransactions = [
        { id: 1, type: 'SIP', fund: 'HDFC Top 100', amount: 15000, date: '1 Dec 2025' },
        { id: 2, type: 'Purchase', fund: 'Nippon Gold ETF', amount: 10000, date: '28 Nov 2025' },
        { id: 3, type: 'Redeem', fund: 'ICICI Corp Bond', amount: -15000, date: '25 Nov 2025' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold">Mutual Funds</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Your investment portfolio</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                        <Plus size={16} />
                        Invest
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard
                        title="Invested"
                        value="₹24.45L"
                        subtitle="Total invested"
                        icon={<Wallet size={20} className="text-blue-400" />}
                        colorClass="bg-blue-950/30 border-blue-900/40"
                    />
                    <StatCard
                        title="Value"
                        value="₹28.94L"
                        subtitle="Current value"
                        icon={<BarChart3 size={20} className="text-emerald-400" />}
                        colorClass="bg-emerald-950/30 border-emerald-900/40"
                    />
                    <StatCard
                        title="Funds"
                        value="8"
                        subtitle="Active funds"
                        icon={<Layers size={20} className="text-violet-400" />}
                        colorClass="bg-violet-950/30 border-violet-900/40"
                    />
                    <StatCard
                        title="SIP"
                        value="₹15,000"
                        subtitle="Monthly"
                        icon={<CalendarCheck size={20} className="text-amber-400" />}
                        colorClass="bg-amber-950/30 border-amber-900/40"
                    />
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search funds..."
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/40 transition-colors"
                                    />
                                </div>
                                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors whitespace-nowrap">
                                    Clear
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {FUND_FILTERS.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setSelectedFilters(prev => toggleFundFilter(prev, filter))}
                                        className={`px-2.5 py-1 text-xs rounded-full transition-colors ${selectedFilters.includes(filter)
                                            ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50'
                                            : 'bg-[#1a1a1a] text-gray-400 hover:text-gray-200 border border-transparent'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl divide-y divide-[#1f1f1f]">
                            {isLoading ? (
                                <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
                            ) : funds.length === 0 ? (
                                <div className="py-12 text-center text-sm text-gray-500">No funds found</div>
                            ) : (
                                funds.map((fund) => (
                                    <div onClick={() => navigate({
                                        to: `/user/mutual-funds/$schemeCode`,
                                        params: { schemeCode: fund.schemeCode }
                                    })}
                                        key={fund.id}
                                        className="px-4 py-3.5 hover:bg-[#181818] transition-colors flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {fund.logo ? (
                                                    <img src={fund.logo} alt="" className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-xs font-medium text-gray-500">{fund.schemeName?.[0]}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{fund.schemeName}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {fund.category} • {fund.subCategory}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-medium text-white">₹{fund.nav?.toLocaleString()}</p>
                                            <div className="flex items-center justify-end gap-1 mt-0.5">
                                                <TrendingUp size={12} className="text-emerald-400" />
                                                <span className="text-xs text-emerald-400">{fund.cagr?.cagr1Y || 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <BarChart3 size={16} /> Allocation
                            </h3>
                            <div className="space-y-2.5">
                                {portfolioAllocation.map((item) => (
                                    <div key={item.name} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-300">{item.name}</span>
                                            <span className="font-medium">{item.value}%</span>
                                        </div>
                                        <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <History size={16} /> Transactions
                            </h3>
                            <div className="space-y-3 text-xs">
                                {recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex justify-between">
                                        <div>
                                            <p className="font-medium text-white">{tx.type} • {tx.fund}</p>
                                            <p className="text-gray-500 mt-0.5">{tx.date}</p>
                                        </div>
                                        <div className={`${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'} font-medium`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-950/30 to-emerald-900/20 border border-emerald-900/40 rounded-xl p-4">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Zap size={16} className="text-emerald-400" /> Actions
                            </h3>
                            <div className="grid gap-2 text-sm">
                                <button className="py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors">
                                    New SIP
                                </button>
                                <button className="py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors">
                                    One-time
                                </button>
                                <button className="py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors">
                                    Redeem
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MutualFundDashboard;