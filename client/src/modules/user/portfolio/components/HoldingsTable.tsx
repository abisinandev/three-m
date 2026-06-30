import { useState } from 'react';
import { TABLE_HEADERS, type PortfolioTab } from '../constants/portfolio.constants';
import { HoldingsTableRow } from './HoldingsTableRow';
import { Pagination } from '@shared/components/pagination/Pagination';
import { formatCurrency, getPnlColor } from '../utils/portfolio.utils';
import type { IInvestmentResponse } from '@shared/types/portfolio.types';

interface HoldingsTableProps {
    items: IInvestmentResponse[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    activeTab: PortfolioTab;
    returnType: 'Absolute' | 'XIRR';
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    search: string;
    onNavigate: (symbol: string) => void;
}

export const HoldingsTable = ({
    items,
    total,
    page,
    limit,
    onPageChange,
    activeTab,
    returnType,
    isLoading,
    isError,
    error,
    search,
    onNavigate,
}: HoldingsTableProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const headers = activeTab === 'stocks'
        ? TABLE_HEADERS.stocks
        : activeTab === 'mf'
            ? TABLE_HEADERS.mf
            : TABLE_HEADERS.all;

    if (isLoading) {
        return (
            <div className="py-10 text-center text-sm text-[#5a5f6e] bg-[#111214] border border-[#1e2025] rounded-lg">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        border: '2px solid #1e2025', borderTopColor: '#00C853',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    <span>Loading holdings…</span>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-10 text-center text-sm text-[#FF1744] bg-[#111214] border border-[#1e2025] rounded-lg">
                Failed — {(error as { message?: string })?.message || 'Unknown error'}
            </div>
        );
    }

    const totalInvested = items.reduce((s, i) => s + (i.amount ?? i.investedAmount ?? 0), 0);
    const totalValue = items.reduce((s, i) => s + (i.currentValue ?? ((i.amount ?? 0) + (i.profit ?? 0))), 0);
    const totalPnl = items.reduce((s, i) => s + (i.profit ?? 0), 0);

    return (
        <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 8, overflow: 'hidden' }}>

            {/* Header Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 110px 120px 110px 14px',
                gap: 8,
                padding: '8px 16px',
                borderBottom: '1px solid #1e2025',
                background: '#0e1014',
            }}>
                {headers.map((h, i) => (
                    <p key={i} className={`text-xs font-semibold text-[#5a5f6e] tracking-wider uppercase m-0 ${i > 0 ? 'text-right' : 'text-left'}`}>
                        {h}
                    </p>
                ))}
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#5a5f6e]">
        
                    {search
                        ? 'No matching holdings found'
                        : activeTab === 'stocks'
                            ? 'No stock holdings yet'
                            : activeTab === 'mf'
                                ? 'No mutual fund holdings yet'
                                : 'No holdings yet'
                    }
                </div>
            ) : (
                <>
                    {items.map((inv, idx) => (
                        <HoldingsTableRow
                            key={inv.schemeCode || idx}
                            inv={inv}
                            isLast={idx === items.length - 1}
                            isExpanded={expandedId === ( inv.schemeCode)}
                            onExpand={setExpandedId}
                            onNavigate={onNavigate}
                            returnType={returnType}
                        />
                    ))}

                    {/* Summary Footer */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 100px 110px 120px 110px 14px',
                        gap: 8,
                        padding: '10px 16px',
                        borderTop: '1px solid #1e2025',
                        background: '#0e1014',
                    }}>
                        <p className="text-sm font-semibold text-[#5a5f6e] m-0">
                            {items.length} holding{items.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-right text-sm font-semibold text-[#9ca3af] m-0 tabular-nums">
                            ₹{formatCurrency(totalInvested, 2)}
                        </p>
                        <p className="text-right text-sm font-semibold text-[#e8eaed] m-0 tabular-nums">
                            ₹{formatCurrency(totalValue, 2)}
                        </p>
                        <p className="text-right text-sm font-bold m-0 tabular-nums" style={{ color: getPnlColor(totalPnl) }}>
                            {`${totalPnl >= 0 ? '+' : ''}₹${formatCurrency(Math.abs(totalPnl), 2)}`}
                        </p>
                        <p style={{ margin: 0 }} />
                        <p style={{ margin: 0 }} />
                    </div>
                </>
            )}

            {/* Pagination */}
            {!search && total > limit && (
                <div style={{ borderTop: '1px solid #1e2025' }}>
                    <Pagination
                        page={page}
                        limit={limit}
                        total={total}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
};
