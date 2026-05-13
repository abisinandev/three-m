import React from 'react';
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
    const color = plain
        ? '#e8eaed'
        : positive === undefined
            ? '#5a5f6e'
            : positive
                ? '#00C853'
                : '#FF1744';

    return (
        <div style={{ paddingLeft: plain ? 0 : 16, borderLeft: plain ? 'none' : '1px solid #1e2025' }}>
            <p style={{ fontSize: 10, color: '#5a5f6e', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4, margin: '0 0 4px' }}>
                {label}
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: 4, margin: 0 }}>
                {showArrow && positive !== undefined && (
                    positive
                        ? <ArrowUpRight size={13} color="#00C853" />
                        : <ArrowDownRight size={13} color="#FF1744" />
                )}
                {value}
            </p>
            {sub && (
                <p style={{ fontSize: 10, color: positive === undefined ? '#5a5f6e' : color, marginTop: 2, margin: '2px 0 0' }}>
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
        <div style={{
            background: '#111214',
            border: '1px solid #1e2025',
            borderRadius: 8,
            padding: '20px 24px',
        }}>
            <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: '#5a5f6e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, margin: '0 0 4px' }}>
                    Portfolio Value
                </p>
                {isLoading ? (
                    <div style={{ height: 36, width: 200, background: '#1e2025', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
                ) : (
                    <p style={{ fontSize: 30, fontWeight: 700, color: '#e8eaed', letterSpacing: '-0.5px', lineHeight: 1, margin: 0 }}>
                        ₹{formatCurrency(currentValue, 2)}
                    </p>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
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
