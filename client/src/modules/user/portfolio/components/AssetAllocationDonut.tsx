'use client';

import { useMemo, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Sector,
} from 'recharts';
import { formatCurrency } from '../utils/portfolio.utils';

// Modern, high-end financial dashboard palette
const COLORS: Record<string, string> = {
    'STOCK': '#10b981',        // Vibrant Emerald
    'MUTUAL_FUND': '#3b82f6',  // Modern Sky Blue
    'MF': '#3b82f6',
    'OTHERS': '#6b7280',
};

const ALT_COLORS = [
    '#8b5cf6', // Violet
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#06b6d4', // Cyan
];

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 6}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                style={{ filter: `drop-shadow(0 0 8px ${fill}44)` }}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 8}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
        </g>
    );
};

interface AssetAllocationProps {
    investments?: any[];
}

export const AssetAllocationDonut = ({ investments = [] }: AssetAllocationProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const data = useMemo(() => {
        if (!investments.length) return [];

        const grouped = investments.reduce((acc, curr) => {
            let key = curr.assetType || curr.investmentType || 'OTHERS';
            if (key === 'MUTUAL_FUND') key = 'MF';
            
            const value = curr.currentValue || curr.amount || 0;

            acc[key] = (acc[key] || 0) + value;
            return acc;
        }, {} as Record<string, number>);

        const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);

        if (total === 0) return [];

        return Object.entries(grouped)
            .map(([name, value], index) => ({
                name: name === 'STOCK' ? 'Stocks' : name === 'MF' ? 'Mutual Funds' : name,
                value,
                percent: (value / total) * 100,
                color: COLORS[name] || ALT_COLORS[index % ALT_COLORS.length]
            }))
            .sort((a, b) => b.value - a.value);
    }, [investments]);

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    const activeItem = activeIndex !== null ? data[activeIndex] : null;

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    if (data.length === 0) {
        return (
            <div style={{
                background: 'rgba(17,18,20,0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 12,
                padding: 24,
                height: 340,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5a5f6e',
            }}>
                <p style={{ fontSize: 13, fontWeight: 500 }}>No assets yet</p>
            </div>
        );
    }

    return (
        <div style={{
            background: 'rgba(17,18,20,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 12,
            padding: 20,
            height: 340,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <h3 style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 12px',
            }}>
                Allocation
            </h3>

            <div style={{ flex: 1, position: 'relative' }}>
                {/* Dynamic Center Display */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    zIndex: 10,
                    marginTop: -10,
                }}>
                    <p style={{ 
                        fontSize: 10, 
                        fontWeight: 600, 
                        color: activeItem ? activeItem.color : '#5a5f6e', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em', 
                        margin: 0,
                        transition: 'color 0.2s'
                    }}>
                        {activeItem ? activeItem.name : 'Total Value'}
                    </p>
                    <p style={{ 
                        fontSize: 16, 
                        fontWeight: 800, 
                        color: '#e8eaed', 
                        margin: '2px 0 0' 
                    }}>
                        ₹{activeItem 
                            ? formatCurrency(activeItem.value, 0) 
                            : formatCurrency(totalValue, 0)
                        }
                    </p>
                    <p style={{ 
                        fontSize: 10, 
                        fontWeight: 600, 
                        color: '#5a5f6e', 
                        margin: 0 
                    }}>
                        {activeItem 
                            ? `${activeItem.percent.toFixed(1)}%` 
                            : 'Portfolio'
                        }
                    </p>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex ?? undefined}
                            activeShape={renderActiveShape}
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={4}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                            stroke="none"
                            animationDuration={800}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<></>} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '12px 20px', 
                marginTop: 16, 
                justifyContent: 'center' 
            }}>
                {data.map((item, i) => (
                    <div 
                        key={i} 
                        onMouseEnter={() => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex(null)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 8, 
                            cursor: 'pointer',
                            opacity: activeIndex === null || activeIndex === i ? 1 : 0.4,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        <div style={{ 
                            width: 8, height: 8, borderRadius: '50%', 
                            background: item.color,
                            boxShadow: `0 0 8px ${item.color}66`
                        }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af' }}>{item.name}</span>
                        <span style={{ fontSize: 11, color: '#5a5f6e' }}>{item.percent.toFixed(0)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
