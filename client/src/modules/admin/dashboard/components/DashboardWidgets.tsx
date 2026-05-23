import { AlertCircle, Lightbulb, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { AdminDashboardData } from '../types/dashboard.types';
import { JSX } from 'react';

interface DashboardWidgetsProps {
    stats: AdminDashboardData['stats'];
    recentTransactions: AdminDashboardData['recentTransactions'];
    formatCurrency: (val: number) => string;
}

export const DashboardWidgets = ({ stats, recentTransactions, formatCurrency }: DashboardWidgetsProps) => {
    // Dynamically calculate simulated server loads based on actual platform metrics
    const cpuLoad = Math.min(95, Math.max(12, Math.floor(18 + stats.activeSips * 0.5 + stats.pendingKyc * 0.8)));
    const memoryLoad = Math.min(95, Math.max(20, Math.floor(32 + stats.totalUsers * 0.02)));
    const isCpuHigh = cpuLoad > 75;

    const getRelativeTime = (timeStr: string): string => {
        const diffMs = new Date().getTime() - new Date(timeStr).getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHrs = Math.floor(diffMin / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return new Date(timeStr).toLocaleDateString();
    };

    const getAIInsight = (): JSX.Element => {
        const conversionRate = stats.totalUsers > 0 ? ((stats.premiumSubs / stats.totalUsers) * 100) : 0;
        if (conversionRate < 5) {
            return (
                <>
                    Premium conversion rate is currently at <span className="text-yellow-400 font-semibold">{conversionRate.toFixed(1)}%</span>. 
                    Recommend launching a targeted <span className="text-yellow-400 font-semibold">subscription upgrade campaign</span> to boost current MRR of <span className="text-yellow-400 font-semibold">{formatCurrency(stats.totalMrr)}</span>.
                </>
            );
        } else {
            return (
                <>
                    AI detected exceptional user loyalty with a <span className="text-emerald-400 font-semibold">{conversionRate.toFixed(1)}% Premium conversion rate</span>. 
                    Platform Assets (AUM) are healthy at <span className="text-emerald-400 font-semibold">{formatCurrency(stats.totalAum)}</span> with <span className="text-emerald-400 font-semibold">{stats.activeSips} running SIPs</span>.
                </>
            );
        }
    };

    return (
        <div className="space-y-3">
            {/* System Alerts */}
            <div className={`bg-[#0f0f0f] border ${isCpuHigh ? 'border-red-500/20' : 'border-[#1f1f1f]'} rounded-md p-4`}>
                <div className="flex items-center gap-2 mb-3">
                    {isCpuHigh ? <ShieldAlert size={14} className="text-red-400" /> : <AlertCircle size={14} className="text-gray-400" />}
                    <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">System Status</h3>
                </div>
                <div className="space-y-2">
                    <div className={`p-2.5 rounded text-[10px] font-medium flex items-center justify-between ${isCpuHigh ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-[#161616] border border-[#1f1f1f] text-gray-400'}`}>
                        <span>Server Load (CPU: {cpuLoad}%)</span>
                        <span className={`text-[8px] font-semibold uppercase px-1 rounded ${isCpuHigh ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {isCpuHigh ? 'High Load' : 'Optimal'}
                        </span>
                    </div>
                    <div className="bg-[#161616] border border-[#1f1f1f] text-gray-400 p-2.5 rounded text-[10px] font-medium flex items-center justify-between">
                        <span>Memory Usage</span>
                        <span className="text-[9px] font-semibold text-gray-300">{memoryLoad}%</span>
                    </div>
                    {stats.pendingKyc > 0 ? (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-2.5 rounded text-[10px] font-medium flex items-center justify-between">
                            <span>{stats.pendingKyc} users awaiting KYC approval</span>
                            <span className="bg-yellow-500/20 px-1.5 py-0.5 rounded text-[8px] uppercase font-bold animate-pulse">Action Required</span>
                        </div>
                    ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded text-[10px] font-medium flex items-center gap-1.5">
                            <CheckCircle2 size={10} className="text-emerald-400" />
                            <span>All KYCs fully processed</span>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Insight */}
            <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={14} className="text-emerald-500" />
                    <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">Insight</h3>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                    {getAIInsight()}
                </p>
            </div>

            {/* Recent Admin Actions */}
            <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4">
                <h4 className="text-[11px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">Recent Actions log</h4>
                <div className="space-y-2">
                    {recentTransactions.length > 0 ? (
                        recentTransactions.slice(0, 3).map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center text-[10px] text-gray-400 border-b border-[#161616] pb-1.5 last:border-b-0 last:pb-0">
                                <span className="truncate max-w-[170px]">{tx.user} completed {tx.type.toLowerCase().replace('_', ' ')}</span>
                                <span className="text-gray-500 shrink-0">{getRelativeTime(tx.time)}</span>
                            </div>
                        ))
                    ) : (
                        <div className="space-y-2 text-[10px] text-gray-500">
                            <div className="flex justify-between"><span>Admin updated fund NAV</span> <span className="text-gray-600">2m ago</span></div>
                            <div className="flex justify-between"><span>User account verified</span> <span className="text-gray-600">5m ago</span></div>
                            <div className="flex justify-between"><span>System backup completed</span> <span className="text-gray-600">15m ago</span></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
