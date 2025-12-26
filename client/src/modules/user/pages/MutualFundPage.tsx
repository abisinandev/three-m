import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Search, ChevronDown, Plus } from 'lucide-react';

const MutualFundsDashboard = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['All Funds']);
    const [expandedFund, setExpandedFund] = useState<string | null>(null);

    const filters = ['All Funds', 'Equity', 'Debt', 'Hybrid', 'Index', 'ELSS', 'International'];

    const toggleFilter = (filter: string) => {
        if (filter === 'All Funds') {
            setSelectedFilters(['All Funds']);
        } else {
            let newFilters = selectedFilters.filter(f => f !== 'All Funds');
            if (newFilters.includes(filter)) {
                newFilters = newFilters.filter(f => f !== filter);
            } else {
                newFilters.push(filter);
            }
            setSelectedFilters(newFilters.length > 0 ? newFilters : ['All Funds']);
        }
    };

    // Mock data with logo URLs (best from search results, suitable for dark theme)
    const holdings = [
        {
            id: '1',
            name: 'HDFC Top 100 Fund',
            category: 'Large Cap • Equity',
            current: 45230,
            returns: 12.89,
            positive: true,
            logo: 'https://seekvectorlogo.com/wp-content/uploads/2019/02/hdfc-mutual-fund-vector-logo.png', // Clean red logo
            invested: 40000,
            units: 520,
            nav: 870.50,
            xirr: 14.2,
        },
        {
            id: '2',
            name: 'ICICI Prudential Corporate Bond',
            category: 'Corporate Bond • Debt',
            current: 32150,
            returns: 8.2,
            positive: true,
            logo: 'https://cdn.brandfetch.io/idzD2Q3USW/w/411/h/242/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1764486966275', // Dark theme version
            invested: 30000,
            units: 1142,
            nav: 28.15,
            xirr: 8.1,
        },
        {
            id: '3',
            name: 'SBI Small Cap Fund',
            category: 'Small Cap • Equity',
            current: 28940,
            returns: 18.7,
            positive: true,
            logo: 'https://images.moneycontrol.com/static-mcnews/2021/12/SBIMF-Logo-slide2.png', // SBI MF logo
            invested: 25000,
            units: 180,
            nav: 160.78,
            xirr: 20.5,
        },
        {
            id: '4',
            name: 'Axis Hybrid Fund',
            category: 'Aggressive Hybrid • Hybrid',
            current: 41680,
            returns: 14.3,
            positive: true,
            logo: 'https://cdn.i.haymarketmedia.asia/?n=campaign-india%2Fcontent%2FAxis-Mutual-Fund-01.png&h=570&w=855&q=100&v=20250320&c=1', // Axis MF logo
            invested: 35000,
            units: 980,
            nav: 42.53,
            xirr: 15.1,
        },
        {
            id: '5',
            name: 'Mirae Asset Tax Saver Fund',
            category: 'Tax Saving • ELSS',
            current: 38750,
            returns: 16.6,
            positive: true,
            logo: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d2/49/96/d2499646-3ce2-b715-4498-1604fd7d84c8/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/1200x630wa.png', // Mirae app icon as proxy (clean)
            invested: 30000,
            units: 750,
            nav: 51.67,
            xirr: 17.8,
        },
        {
            id: '6',
            name: 'UTI Nifty Index Fund',
            category: 'Index • Nifty 50',
            current: 52100,
            returns: 11.9,
            positive: true,
            logo: 'https://preview.redd.it/now-i-feel-this-was-a-mistake-v0-ryi9f28z4zhf1.png?auto=webp&s=6b344779fdf0570fdad4a22fc254e4b7578baf25', // Nifty-related screenshot as example badge
            invested: 45000,
            units: 420,
            nav: 124.05,
            xirr: 12.5,
        },
        {
            id: '7',
            name: 'HDFC Gold Fund',
            category: 'Gold ETF • Gold',
            current: 25600,
            returns: 9.4,
            positive: true,
            logo: 'https://thumbs.dreamstime.com/b/single-gold-bar-rests-dark-surface-front-financial-stock-market-graph-featuring-green-red-candlesticks-upward-417621233.jpg', // Gold bar icon for dark theme
            invested: 20000,
            units: 980,
            nav: 26.12,
            xirr: 10.2,
        },
    ];

    const summary = {
        totalInvestment: 245000,
        currentValue: 289450,
        activeFunds: 8,
        monthlySIP: 15000,
    };

    const allocation = [
        { name: 'Equity', pct: 65, color: '#3B82F6' },
        { name: 'Debt', pct: 25, color: '#22C55E' },
        { name: 'Others', pct: 10, color: '#FBBF24' },
    ];

    const transactions = [
        { desc: 'SIP - HDFC Top 100', date: 'Dec 1, 2023', amount: 5000, positive: true },
        { desc: 'Purchase - Gold Fund', date: 'Nov 28, 2023', amount: 10000, positive: true },
        { desc: 'Redemption - Debt Fund', date: 'Nov 25, 2023', amount: 15000, positive: false },
    ];

    return (
        <div className="space-y-8">
            {/* 1. Minimal Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-semibold text-[#E5E7EB]">Mutual Funds</h1>
                    <p className="text-[11px] text-[#6B7280] mt-1">Overview of your mutual fund investments</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/10 transition">
                    <Plus size={14} />
                    Invest
                </button>
            </div>

            {/* 2. Stat Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Investment', value: `₹${summary.totalInvestment.toLocaleString()}`, sub: 'Since inception' },
                    { label: 'Current Value', value: `₹${summary.currentValue.toLocaleString()}`, sub: '' },
                    { label: 'Active Funds', value: summary.activeFunds, sub: '' },
                    { label: 'Monthly SIP', value: `₹${summary.monthlySIP.toLocaleString()}`, sub: '' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg p-4">
                        <p className="text-[11px] uppercase tracking-wide text-[#9CA3AF]">{stat.label}</p>
                        <p className="text-sm font-medium text-[#E5E7EB] mt-1">{stat.value}</p>
                        {stat.sub && <p className="text-[11px] text-[#6B7280] mt-1">{stat.sub}</p>}
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Filters + My Mutual Funds */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 5. Utility Filters */}
                    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[11px] uppercase tracking-wide text-[#9CA3AF]">Filter by Fund Type</p>
                            <button className="text-[11px] text-[#22C55E] hover:underline">Clear All</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => toggleFilter(filter)}
                                    className={`px-3 py-1 text-xs rounded-md transition ${selectedFilters.includes(filter)
                                            ? 'bg-[#171717] text-[#E5E7EB] border border-[#333]'
                                            : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. My Mutual Funds List with Logos & Expandable */}
                    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg">
                        <div className="p-4 border-b border-[#1f1f1f]">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E5E7EB]">My Mutual Funds</h3>
                            <div className="relative mt-3">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                                <input
                                    type="text"
                                    placeholder="Search funds..."
                                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg pl-9 pr-4 py-2 text-xs text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#22C55E]/50"
                                />
                            </div>
                        </div>
                        <div className="divide-y divide-[#1f1f1f]">
                            {holdings.map((fund) => (
                                <div key={fund.id}>
                                    <div
                                        className="flex items-center justify-between p-4 hover:bg-[#111] transition cursor-pointer"
                                        onClick={() => setExpandedFund(expandedFund === fund.id ? null : fund.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2a2a2a] flex-shrink-0">
                                                <img src={fund.logo} alt={`${fund.name} logo`} className="w-full h-full object-contain bg-[#0f0f0f]" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-[#E5E7EB] truncate max-w-[180px]">{fund.name}</p>
                                                <p className="text-[11px] text-[#6B7280] mt-0.5">{fund.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-[#E5E7EB]">₹{fund.current.toLocaleString()}</p>
                                            <p className={`text-[11px] flex items-center justify-end gap-1 mt-0.5 ${fund.positive ? 'text-[#22C55E]' : 'text-red-500'}`}>
                                                {fund.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {fund.returns.toFixed(2)}%
                                            </p>
                                        </div>
                                        <ChevronDown size={14} className={`text-[#6B7280] transition ${expandedFund === fund.id ? 'rotate-180' : ''}`} />
                                    </div>
                                    {expandedFund === fund.id && (
                                        <div className="px-4 pb-4 pt-2 bg-[#111]">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] mb-4">
                                                <div>
                                                    <p className="text-[#6B7280]">Invested</p>
                                                    <p className="text-[#E5E7EB]">₹{fund.invested.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#6B7280]">Units</p>
                                                    <p className="text-[#E5E7EB]">{fund.units}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#6B7280]">NAV</p>
                                                    <p className="text-[#E5E7EB]">₹{fund.nav}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#6B7280]">XIRR</p>
                                                    <p className="text-[#22C55E]">{fund.xirr}%</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button className="px-3 py-1.5 text-xs text-[#22C55E] border border-[#22C55E]/50 rounded hover:bg-[#22C55E]/10 transition">
                                                    Invest More
                                                </button>
                                                <button className="px-3 py-1.5 text-xs text-red-400 border border-red-500/50 rounded hover:bg-red-900/20 transition">
                                                    Redeem
                                                </button>
                                                <button className="px-3 py-1.5 text-xs text-[#9CA3AF] border border-[#333] rounded hover:bg-[#1a1a1a] transition">
                                                    View Fund
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (unchanged but refined) */}
                <div className="space-y-6">
                    {/* Allocation */}
                    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg p-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E5E7EB] mb-4">Portfolio Allocation</h3>
                        <div className="space-y-4">
                            {allocation.map((item) => (
                                <div key={item.name}>
                                    <div className="flex justify-between text-[11px] mb-1">
                                        <span className="text-[#9CA3AF]">{item.name}</span>
                                        <span className="text-[#9CA3AF]">{item.pct}%</span>
                                    </div>
                                    <div className="w-full bg-[#111] rounded-full h-2">
                                        <div className="h-2 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Transactions - Timeline feel */}
                    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg p-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E5E7EB] mb-4">Recent Transactions</h3>
                        <div className="space-y-4">
                            {transactions.map((tx, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-[#22C55E]/50" />
                                    <div className="flex-1">
                                        <p className="text-xs text-[#E5E7EB]">{tx.desc}</p>
                                        <p className="text-[11px] text-[#6B7280]">{tx.date}</p>
                                    </div>
                                    <p className={`text-xs font-medium ${tx.positive ? 'text-[#22C55E]' : 'text-red-500'}`}>
                                        {tx.positive ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions - Demoted */}
                    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg p-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E5E7EB] mb-4">Quick Actions</h3>
                        <button className="w-full py-2 text-xs font-medium bg-[#22C55E] text-black rounded-lg hover:bg-[#22C55E]/90 transition">
                            Start New SIP
                        </button>
                        <div className="mt-3 space-y-2">
                            <button className="w-full py-2 text-xs text-[#9CA3AF] hover:text-[#E5E7EB] transition">One-time Investment</button>
                            <button className="w-full py-2 text-xs text-[#9CA3AF] hover:text-[#E5E7EB] transition">Redeem Funds</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MutualFundsDashboard;