import { useState, useMemo } from 'react';
import { Search, RefreshCw, CheckCircle2, AlertTriangle, Database } from 'lucide-react';
import type { NavMonitoring } from '../types/SipTypes';
import { StatsCardComponent } from '@shared/components/cards/StatCardComponent';

const MOCK_NAV: NavMonitoring[] = [
    {
        schemeCode: '100123',
        navDate: '2026-01-18',
        navValue: 124.56,
        fetchStatus: 'SUCCESS',
        lastUpdatedTime: '2026-01-19 09:30 AM',
    },
    {
        schemeCode: '100456',
        navDate: '2026-01-18',
        navValue: 89.12,
        fetchStatus: 'SUCCESS',
        lastUpdatedTime: '2026-01-19 09:35 AM',
    },
    {
        schemeCode: '100789',
        navDate: '2026-01-17',
        navValue: 345.67,
        fetchStatus: 'DELAYED',
        lastUpdatedTime: '2026-01-18 04:00 PM',
    },
];

const NavMonitoringPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [navData] = useState<NavMonitoring[]>(MOCK_NAV);

    const stats = useMemo(() => {
        return {
            synced: navData.filter(n => n.fetchStatus === 'SUCCESS').length,
            delayed: navData.filter(n => n.fetchStatus === 'DELAYED').length,
            total: navData.length
        }
    }, [navData]);

    const filteredNav = navData.filter((item) =>
        item.schemeCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-semibold text-white">NAV Monitoring</h1>
                    <p className="text-xs text-neutral-400">
                        Real-time tracking of Scheme Net Asset Values
                    </p>
                </div>
                <button className="bg-neutral-800 border border-neutral-700 text-neutral-300 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-700 transition-all flex items-center gap-2">
                    <RefreshCw size={14} className="text-emerald-500" />
                    Force Sync
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCardComponent
                    title="Synced Today"
                    value={stats.synced}
                    icon={<CheckCircle2 size={20} />}
                    color="emerald"
                    subtitle="Updated in last 24h"
                />
                <StatsCardComponent
                    title="Delayed/Pending"
                    value={stats.delayed}
                    icon={<AlertTriangle size={20} />}
                    color="amber"
                    subtitle="Manual check required"
                />
                <StatsCardComponent
                    title="Total Schemes"
                    value={stats.total}
                    icon={<Database size={20} />}
                    color="blue"
                    subtitle="Configured for tracking"
                />
            </div>

            {/* Search & Actions */}
            <div className="bg-[#111] p-4 rounded-xl border border-neutral-800">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
                    <input
                        type="text"
                        placeholder="Filter by Scheme Code..."
                        className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-neutral-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* NAV Table */}
            <div className="bg-[#111] rounded-xl border border-neutral-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-neutral-900/50 border-b border-neutral-800">
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Scheme Code</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">NAV Value</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">NAV Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Fetch Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-right">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {filteredNav.map((item) => (
                                <tr key={item.schemeCode} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 font-mono text-[13px] text-blue-400 font-bold tracking-tight">{item.schemeCode}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-lg font-bold text-white tracking-tight">₹{item.navValue.toFixed(4)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-block bg-neutral-800 text-neutral-300 px-3 py-1 rounded-lg text-xs font-bold border border-neutral-700">
                                            {item.navDate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${item.fetchStatus === 'SUCCESS'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {item.fetchStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-[12px] text-neutral-500 font-medium group-hover:text-neutral-300 transition-colors">{item.lastUpdatedTime}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NavMonitoringPage;
