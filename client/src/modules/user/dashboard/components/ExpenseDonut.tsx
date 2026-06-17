import { formatCompact } from '../../helpers/format';
import { Skeleton } from './Skeleton';

export const ExpenseDonut = ({
    totalExpenses, needsSpent, wantsSpent, savingsSpent, isLoading,
}: {
    totalExpenses: number; needsSpent: number; wantsSpent: number; savingsSpent: number; isLoading: boolean;
}) => {
    const CATS = [
        { label: 'Needs', color: '#10b981', value: needsSpent },
        { label: 'Wants', color: '#3b82f6', value: wantsSpent },
        { label: 'Savings', color: '#a855f7', value: savingsSpent },
    ];

    const total = needsSpent + wantsSpent + savingsSpent || 1;
    const R = 44, cx = 56, cy = 56, stroke = 12;
    const circ = 2 * Math.PI * R;

    let offset = 0;
    const arcs = CATS.map(cat => {
        const pct = cat.value / total;
        const arc = { ...cat, dasharray: pct * circ, offset, pct };
        offset += pct * circ;
        return arc;
    });

    return (
        <div className="flex-1 flex items-center gap-5 py-1">
            {/* SVG donut */}
            <div className="relative shrink-0">
                {isLoading ? (
                    <Skeleton className="w-28 h-28 rounded-full" />
                ) : (
                    <svg width="112" height="112" viewBox="0 0 112 112">
                        {/* bg track */}
                        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1f1f1f" strokeWidth={stroke} />
                        {arcs.map((a, i) => (
                            <circle
                                key={i} cx={cx} cy={cy} r={R}
                                fill="none" stroke={a.color} strokeWidth={stroke}
                                strokeDasharray={`${a.dasharray} ${circ}`}
                                strokeDashoffset={-a.offset}
                                strokeLinecap="butt"
                                style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
                            />
                        ))}
                        <text x={cx} y={cy - 7} textAnchor="middle" fill="#f3f4f6" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">
                            {formatCompact(totalExpenses)}
                        </text>
                        <text x={cx} y={cy + 8} textAnchor="middle" fill="#6b7280" fontSize="10" fontWeight="500" fontFamily="Inter, sans-serif">
                            SPENT
                        </text>
                    </svg>
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2.5 flex-1">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-7 w-full rounded" />)
                    : CATS.map((cat) => {
                        const pct = total > 1 ? ((cat.value / total) * 100).toFixed(0) : '0';
                        return (
                            <div key={cat.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                    <span className="text-xs text-gray-400 font-medium">{cat.label}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-semibold text-gray-200 tabular-nums">{formatCompact(cat.value)}</span>
                                    <span className="text-xs text-gray-500 ml-1 tabular-nums">({pct}%)</span>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};
