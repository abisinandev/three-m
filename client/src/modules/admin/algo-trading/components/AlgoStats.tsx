import React from 'react';
import { Cpu, Activity, BarChart2, AlertTriangle, Clock } from 'lucide-react';
import { StatCard } from './StatCard';
import type { AlgoStatsData as IAlgoStats } from '@/modules/admin/algo-trading/types/algo-trading.types';

interface AlgoStatsProps {
    stats: Partial<IAlgoStats>;
}

export const AlgoStats: React.FC<AlgoStatsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <StatCard
                title="ACTIVE STRATEGIES"
                value={stats.activeStrategiesCount?.toString() || "—"}
                subtitle="Live data"
                icon={<Cpu size={16} className="text-emerald-500" />}
                valueClass="text-white"
            />
            <StatCard
                title="TOTAL SIGNALS"
                value={stats.activeSignalsCount?.toString() || "—"}
                subtitle="All signals"
                icon={<Activity size={16} className="text-emerald-500" />}
                valueClass="text-white"
            />
            <StatCard
                title="TRADES EXECUTED TODAY"
                value={stats.tradesExecutedTodayCount?.toString() || "—"}
                subtitle="Live data"
                icon={<BarChart2 size={16} className="text-emerald-500" />}
                valueClass="text-white"
            />
            <StatCard
                title="FAILED TRADES"
                value={stats.failedTradesCount?.toString() || "—"}
                subtitle="Live data"
                icon={<AlertTriangle size={16} className="text-emerald-500" />}
                valueClass="text-red-500"
                alertIcon
            />
            {/* Market Status Card */}
            <div className="bg-[#111214] rounded-lg p-4 flex flex-col justify-between border border-[#1e2025] min-h-[110px] shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[10px] font-semibold text-[#5a5f6e] tracking-wider uppercase">MARKET STATUS</h3>
                    <div className="p-1.5 bg-[#1a1c20] rounded-md">
                        <Clock size={16} className="text-emerald-500" />
                    </div>
                </div>
                <div>
                    <div className="text-xl font-bold text-emerald-500 mb-1 leading-none tracking-wide text-center uppercase">
                        {stats.marketStatus || "OPEN"}
                    </div>
                    <div className="text-[10px] text-[#5a5f6e] text-center">NSE / BSE</div>
                </div>
            </div>
        </div>
    );
};
