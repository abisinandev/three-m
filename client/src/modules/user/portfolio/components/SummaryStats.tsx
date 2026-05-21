import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/portfolio.utils';

interface StatColProps {
    label: string;
    value: string;
    sub: string;
    positive?: boolean;
    plain?: boolean;
    showArrow?: boolean;
}

const StatCol = ({
    label,
    value,
    sub,
    positive,
    plain,
    showArrow,
}: StatColProps) => {
    const colorClass = plain
        ? 'text-[#e8eaed]'
        : positive === undefined
            ? 'text-[#5a5f6e]'
            : positive
                ? 'text-[#00C853]'
                : 'text-[#FF1744]';

    return (
        <div className={`flex flex-col ${plain ? 'pl-0 border-none' : 'pl-4 sm:pl-6 border-l border-[#1e2025]'}`}>
            <p className="text-[10px] text-[#5a5f6e] tracking-wider uppercase mb-1 m-0">
                {label}
            </p>
            <p className={`text-sm font-bold flex items-center gap-1 m-0 ${colorClass}`}>
                {showArrow && positive !== undefined && (
                    positive
                        ? <ArrowUpRight size={13} className="text-[#00C853]" />
                        : <ArrowDownRight size={13} className="text-[#FF1744]" />
                )}
                {value}
            </p>
            {sub && (
                <p className={`text-[10px] mt-0.5 m-0 ${positive === undefined ? 'text-[#5a5f6e]' : colorClass}`}>
                    {sub}
                </p>
            )}
        </div>
    );
};

interface SummaryStatsProps {
    currentValue: number;
    totalInvestment: number;
    profitAfterSell: number;
    totalReturns: number;
    profitPercentage: number;
    isLoading: boolean;
}

export const SummaryStats = ({
    currentValue,
    totalInvestment,
    profitAfterSell,
    totalReturns,
    profitPercentage,
    isLoading,
}: SummaryStatsProps) => {
    const positive = totalReturns >= 0;

    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5 sm:p-6 shadow-sm">
            <div className="mb-6">
                <p className="text-[11px] text-[#5a5f6e] tracking-wider uppercase mb-1 m-0">
                    Portfolio Value
                </p>
                {isLoading ? (
                    <div className="h-9 w-48 bg-[#1e2025] rounded animate-pulse" />
                ) : (
                    <p className="text-[28px] sm:text-[32px] font-bold text-[#e8eaed] tracking-tight leading-none m-0">
                        ₹{formatCurrency(currentValue, 2)}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0">
                <StatCol
                    label="Invested"
                    value={`₹${formatCurrency(totalInvestment, 2)}`}
                    sub=""
                    plain
                />
                <StatCol
                    label="Returns"
                    value={`${positive ? '+' : ''}₹${formatCurrency(Math.abs(totalReturns), 2)}`}
                    sub={`${positive ? '+' : ''}${profitPercentage.toFixed(2)}%`}
                    positive={positive}
                    showArrow
                />
                <StatCol
                    label="Realized P&L"
                    value={`${profitAfterSell >= 0 ? '+' : ''}₹${formatCurrency(profitAfterSell, 2)}`}
                    sub="Settled"
                    positive={profitAfterSell >= 0}
                />
            </div>
        </div>
    );
};
