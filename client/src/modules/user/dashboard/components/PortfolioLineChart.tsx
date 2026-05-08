import { TrendingUp } from 'lucide-react';
import { formatCompact } from '../../helpers/format';
import { Skeleton } from './Skeleton';
import type { PortfolioGrowthPoint } from '../types/dashboard.types';

export const PortfolioLineChart = ({ data, isLoading }: { data: PortfolioGrowthPoint[]; isLoading: boolean }) => {
    const W = 420, H = 110, PAD = { top: 12, right: 8, bottom: 4, left: 0 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    if (isLoading) {
        return (
            <div className="flex-1 flex items-end gap-1 min-h-[7rem] pt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-1">
                        <Skeleton className="w-full" style={{ height: `${30 + i * 12}%` }} />
                    </div>
                ))}
            </div>
        );
    }

    const hasData = data.some(d => d.amount > 0);
    if (!hasData) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[7rem] gap-2 text-gray-600">
                <TrendingUp className="w-8 h-8 opacity-30" />
                <p className="text-[10px] uppercase tracking-wider">No investment data yet</p>
            </div>
        );
    }

    const maxVal = Math.max(...data.map(d => d.amount), 1);
    const minVal = 0;
    const range = maxVal - minVal || 1;

    const pts = data.map((d, i) => ({
        x: PAD.left + (i / (data.length - 1)) * chartW,
        y: PAD.top + (1 - (d.amount - minVal) / range) * chartH,
        ...d,
    }));

    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

    // Growth %
    const first = data[0]?.amount ?? 0;
    const last = data[data.length - 1]?.amount ?? 0;
    const growthPct = first > 0 ? (((last - first) / first) * 100).toFixed(1) : null;

    return (
        <div className="flex flex-col flex-1">
            {/* Value + growth badge */}
            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-sm font-bold text-gray-100">{formatCompact(last)}</span>
                {growthPct !== null && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${Number(growthPct) >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {Number(growthPct) >= 0 ? '+' : ''}{growthPct}%
                    </span>
                )}
                <span className="text-[9px] text-gray-600 ml-auto uppercase tracking-wider">6-month growth</span>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: 110 }}>
                <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                {/* Area fill */}
                <path d={areaD} fill="url(#lineGrad)" />
                {/* Line */}
                <path d={pathD} fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                {/* Dots */}
                {pts.map((p, i) => (
                    <g key={i} className="group">
                        <circle cx={p.x} cy={p.y} r="3" fill="#10b981" stroke="#0f0f0f" strokeWidth="1.5" />
                        {/* Tooltip */}
                        <g opacity="0" style={{ transition: 'opacity 0.15s' }}>
                            <rect x={p.x - 22} y={p.y - 22} width="44" height="16" rx="3" fill="#1f1f1f" />
                            <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#e5e7eb" fontSize="8" fontFamily="monospace">
                                {formatCompact(p.amount)}
                            </text>
                        </g>
                    </g>
                ))}
            </svg>

            {/* Month labels */}
            <div className="flex justify-between mt-1.5 px-0.5">
                {data.map((d) => (
                    <span key={d.month} className="text-[9px] text-gray-600 font-medium uppercase tracking-wider">{d.month}</span>
                ))}
            </div>
        </div>
    );
};
