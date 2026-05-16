import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../helpers/expense-helpers';

interface StatColProps {
    label: string;
    value: string;
    sub: string;
    positive?: boolean;
    plain?: boolean;
    showArrow?: boolean;
    icon?: React.ReactNode;
}

const StatCol = ({
    label,
    value,
    sub,
    positive,
    plain,
    showArrow,
    icon
}: StatColProps) => {
    const textColorClass = plain
        ? 'text-[#e8eaed]'
        : positive === undefined
            ? 'text-[#5a5f6e]'
            : positive
                ? 'text-[#00C853]'
                : 'text-[#F43F5E]';

    const subColorClass = positive === undefined ? 'text-[#5a5f6e]' : textColorClass;

    return (
        <div className={`${plain ? 'pl-0 border-none' : 'pl-4 border-l border-[#1e2025]'}`}>
            <p className="text-[10px] text-[#5a5f6e] tracking-[0.06em] uppercase flex items-center gap-1.5 m-0 mb-1">
                {icon} {label}
            </p>
            <p className={`text-[13px] font-bold flex items-center gap-1 m-0 ${textColorClass}`}>
                {showArrow && positive !== undefined && (
                    positive
                        ? <ArrowUpRight size={13} color="#00C853" />
                        : <ArrowDownRight size={13} color="#F43F5E" />
                )}
                {value}
            </p>
            {sub && (
                <p className={`text-[9px] font-bold mt-0.5 m-0 mb-0 text-opacity-80 uppercase ${subColorClass}`}>
                    {sub}
                </p>
            )}
        </div>
    );

};

interface TopSummaryProps {
    filteredSpent: number;
    currentBalance: number;
    totalIncome: number;
    incomeSourcesCount: number;
    usagePercent: number;
    filteredSpentMinusIncome: number;
    filteredSavings: number;
}

export const TopSummary = ({
    filteredSpent,
    currentBalance,
    totalIncome,
    incomeSourcesCount,
    usagePercent,
    filteredSavings
}: TopSummaryProps) => {

    const positive = currentBalance >= 0;
    const netSavings = filteredSavings + Math.max(0, currentBalance);

    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg py-5 px-6 grid grid-cols-[300px_1fr] gap-6 items-center">
            <div className="border-r border-[#1e2025] pr-6">
                <p className="text-[10px] text-[#5a5f6e] tracking-[0.08em] uppercase m-0 mb-1">
                    Available Balance
                </p>
                <p className={`text-[28px] font-bold tracking-[-0.5px] leading-none m-0 ${positive ? 'text-[#e8eaed]' : 'text-[#F43F5E]'}`}>
                    {formatCurrency(currentBalance)}
                </p>
                <div className="flex items-center gap-1.5 mt-2.5">
                    <div className="w-10 h-1 bg-[#1e2025] rounded-sm overflow-hidden">
                        <div className={`h-full ${usagePercent > 100 ? 'bg-[#F43F5E]' : 'bg-[#3B82F6]'}`} style={{ width: `${Math.min(100, usagePercent)}%` }} />
                    </div>
                    <span className="text-[9px] font-extrabold text-[#5a5f6e]">{usagePercent.toFixed(0)}% UTILIZED</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-0">

                <StatCol
                    label="Total Income"
                    value={formatCurrency(totalIncome)}
                    sub={`${incomeSourcesCount} SOURCES`}
                    plain
                    icon={<TrendingUp size={10} color="#3B82F6" />}
                />
                <StatCol
                    label="Total Expenses"
                    value={formatCurrency(filteredSpent)}
                    sub="NEEDS & WANTS"
                    positive={false}
                    icon={<TrendingDown size={10} color="#F43F5E" />}
                />
                <StatCol
                    label="Savings Output"
                    value={formatCurrency(filteredSavings)}
                    sub={`NET: ${formatCurrency(netSavings)}`}
                    positive={true}
                    icon={<PiggyBank size={10} color="#00C853" />}
                    showArrow
                />
            </div>
        </div>
    );
};
