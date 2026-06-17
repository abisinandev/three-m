'use client';
import { useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Sector,
} from 'recharts';
import { formatCurrency } from '../helpers/expense-helpers';
import type { BudgetPatternProps } from '@/shared/types/user/expense.types';


interface ActiveShapeProps {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
}

const renderActiveShape = (props: ActiveShapeProps) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 4}
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
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 8}
                fill={fill}
            />
        </g>
    );
};

export const BudgetPattern = ({
    activeChartData,
    filteredSpent,
    totalIncome,

    filteredSavings,
    unspentBalance
}: BudgetPatternProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const onPieEnter = (_: unknown, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    const activeItem = activeIndex !== null ? activeChartData[activeIndex] : null;
    const totalOutput = filteredSpent + filteredSavings;

    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5 h-[340px] flex flex-col relative">
            <h3 className="text-xs font-bold text-[#5a5f6e] uppercase tracking-widest m-0 mb-3">
                Budget Allocation
            </h3>

            <div className="flex-1 relative">

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10 -mt-1.5">
                    <p
                        className="text-xs font-bold uppercase tracking-wider m-0"
                        style={{ color: activeItem ? activeItem.color : '#5a5f6e' }}
                    >
                        {activeItem ? activeItem.name : 'Total Out'}
                    </p>
                    <p className="text-lg font-extrabold text-[#e8eaed] mt-0.5 m-0 tabular-nums">
                        {formatCurrency(activeItem ? activeItem.value : totalOutput)}
                    </p>
                    <p className="text-xs font-semibold text-[#5a5f6e] m-0 tabular-nums">
                        {activeItem
                            ? `${totalIncome > 0 ? ((activeItem.value / totalIncome) * 100).toFixed(1) : 0}%`
                            : 'of Income'
                        }
                    </p>
                </div>

                <ResponsiveContainer width="100%" height="100%">

                    <PieChart>
                        <Pie
                            activeShape={renderActiveShape as unknown as React.ComponentProps<typeof Pie>["activeShape"]}
                            data={activeChartData as unknown as React.ComponentProps<typeof Pie>["data"]}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                            stroke="none"
                            animationDuration={600}
                        >
                            {activeChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<></>} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 justify-center">
                {activeChartData.map((item, i) => (
                    <div
                        key={i}
                        onMouseEnter={() => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex(null)}
                        className={`flex items-center gap-1.5 cursor-pointer transition-opacity duration-200 ${activeIndex === null || activeIndex === i ? 'opacity-100' : 'opacity-40'}`}
                    >
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs font-bold text-[#e8eaed]">{item.name}</span>
                        <span className="text-xs text-[#5a5f6e] tabular-nums">{totalIncome > 0 ? ((item.value / totalIncome) * 100).toFixed(0) : 0}%</span>
                    </div>
                ))}

                {unspentBalance > 0 && (
                    <div className="flex items-center gap-1.5 opacity-60">
                        <div className="w-1.5 h-1.5 rounded-full border border-[#5a5f6e]" />
                        <span className="text-xs font-bold text-[#5a5f6e]">Remaining Amount</span>
                        <span className="text-xs text-[#5a5f6e] tabular-nums">{totalIncome > 0 ? ((unspentBalance / totalIncome) * 100).toFixed(0) : 0}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};

