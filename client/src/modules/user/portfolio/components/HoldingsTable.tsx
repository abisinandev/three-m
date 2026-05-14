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
            <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: '#5a5f6e', background: '#111214', border: '1px solid #1e2025', borderRadius: 8 }}>
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
            <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: '#FF1744', background: '#111214', border: '1px solid #1e2025', borderRadius: 8 }}>
                Failed — {error?.message || 'Unknown error'}
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
                    <p key={i} style={{
                        fontSize: 10, fontWeight: 600, color: '#5a5f6e',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        textAlign: i > 0 ? 'right' : 'left', margin: 0,
                    }}>{h}</p>
                ))}
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
                <div style={{ padding: '48px 0', textAlign: 'center', fontSize: 12, color: '#5a5f6e' }}>
        
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
                            key={inv.id || inv.schemeCode || idx}
                            inv={inv}
                            idx={idx}
                            isLast={idx === items.length - 1}
                            isExpanded={expandedId === (inv.id || inv.schemeCode)}
                            onExpand={setExpandedId}
                            onNavigate={onNavigate}
                            returnType={returnType}
                            activeTab={activeTab}
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
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#5a5f6e', margin: 0 }}>
                            {items.length} holding{items.length !== 1 ? 's' : ''}
                        </p>
                        <p style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: '#9ca3af', margin: 0 }}>
                            ₹{formatCurrency(totalInvested, 2)}
                        </p>
                        <p style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: '#e8eaed', margin: 0 }}>
                            ₹{formatCurrency(totalValue, 2)}
                        </p>
                        <p style={{
                            textAlign: 'right', fontSize: 11, fontWeight: 700, margin: 0,
                            color: getPnlColor(totalPnl),
                        }}>
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
