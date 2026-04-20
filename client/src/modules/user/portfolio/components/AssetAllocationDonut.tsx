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

const renderTooltipContent = ({ active, payload, totalValue }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{
                background: '#111214',
                border: '1px solid #1e2025',
                borderRadius: 6,
                padding: 12,
                fontSize: 12,
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.4)',
                zIndex: 50,
            }}>
                <p style={{ fontWeight: 600, color: '#e8eaed', marginBottom: 4, margin: 0 }}>{data.name}</p>
                <p style={{ color: '#9ca3af', margin: 0 }}>
                    {data.percent.toFixed(1)}%
                    {totalValue > 0 && (
                        <span style={{ opacity: 0.7, marginLeft: 8 }}>
                            (₹{data.value.toLocaleString('en-IN')})
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

export const AssetAllocationDonut = ({ investments = [] }: AssetAllocationProps) => {
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
            <div style={{
                background: 'rgba(17,18,20,0.5)',
                border: '1px solid #1e2025',
                borderRadius: 8,
                padding: 16,
                height: 320,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5a5f6e',
            }}>
                <p style={{ fontSize: 12 }}>No holdings to display</p>
            </div>
        );
    }

    return (
        <div style={{
            background: 'rgba(17,18,20,0.5)',
            border: '1px solid #1e2025',
            borderRadius: 8,
            padding: 16,
            height: 320,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <h3 style={{
                fontSize: 10,
                fontWeight: 600,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 16,
                margin: '0 0 16px',
            }}>
                Asset Allocation
            </h3>

            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
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
                            formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
