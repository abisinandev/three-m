'use client';

import { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import type { IInvestmentResponse } from '@shared/types/portfolio.types';
import type { PieChartTooltipProps } from '@/shared/types/user/dashboard.types';

const COLORS = [
    '#3b82f6',
    '#60a5fa',
    '#6b7280',
    '#9ca3af',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
];

const renderTooltipContent = ({ active, payload, totalValue }: PieChartTooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-zinc-900 border border-zinc-700 rounded-md p-3 text-xs shadow-xl z-50">
                <p className="font-medium text-white mb-1">{data.name}</p>
                <p className="text-zinc-300">
                    {data.percent.toFixed(1)}%
                    {totalValue > 0 && (
                        <span className="opacity-70 ml-2">
                            (₹{data.value.toLocaleString()})
                        </span>
                    )}
                </p>
            </div>
        );
    }
    return null;
};

interface AssetAllocationProps {
    investments?: IInvestmentResponse[];
}

export default function AssetAllocationDonut({ investments = [] }: AssetAllocationProps) {
    const data = useMemo(() => {
        if (!investments.length) return [];

        const grouped = investments.reduce((acc, curr) => {
            const key = curr.category || curr.investmentType || 'Others';
            const value = (curr.units && curr.nav) ? (curr.units * curr.nav) : curr.amount;

            acc[key] = (acc[key] || 0) + value;
            return acc;
        }, {} as Record<string, number>);

        const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);

        if (total === 0) return [];

        return Object.entries(grouped)
            .map(([name, value], index) => ({
                name,
                value,
                percent: (value / total) * 100,
                color: COLORS[index % COLORS.length]
            }))
            .sort((a, b) => b.value - a.value);
    }, [investments]);

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    if (data.length === 0) {
        return (
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4 h-[320px] flex flex-col items-center justify-center text-zinc-500">
                <p className="text-xs">No holdings to display</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4 h-[320px] flex flex-col">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">
                Asset Allocation
            </h3>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>

                        <Tooltip
                            content={(props) => renderTooltipContent({ ...props, totalValue })}
                        />

                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{
                                fontSize: '11px',
                                paddingTop: '12px',
                            }}
                            formatter={(value) => <span className="text-zinc-300">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

