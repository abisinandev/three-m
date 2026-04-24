import { useState } from 'react';
import { TABLE_HEADERS, type PortfolioTab } from '../constants/portfolio.constants';
import { HoldingsTableRow } from './HoldingsTableRow';
import { Pagination } from '@shared/components/pagination/Pagination';
import { formatCurrency, getPnlColor } from '../utils/portfolio.utils';

interface HoldingsTableProps {
    items: any[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    activeTab: PortfolioTab;
    returnType: 'Absolute' | 'XIRR';
    isLoading: boolean;
    isError: boolean;
    error: any;
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

    const headers = (activeTab === 'stocks' || activeTab === 'mf')
        ? TABLE_HEADERS[activeTab]
        : TABLE_HEADERS.all;

    if (isLoading) {
        return (
            <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: '#5a5f6e', background: '#111214', border: '1px solid #1e2025', borderRadius: 8 }}>
                Loading holdings…
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

    return (
        <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 110px 120px 110px 14px',
                gap: 8,
                padding: '8px 16px',
                borderBottom: '1px solid #1e2025',
            }}>
                {headers.map((h, i) => (
                    <p key={i} style={{
                        fontSize: 10, fontWeight: 600, color: '#5a5f6e',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        textAlign: i > 0 ? 'right' : 'left', margin: 0,
                    }}>{h}</p>
                ))}
            </div>

            {items.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: '#5a5f6e' }}>
                    {search ? 'No matching holdings' : 'No holdings yet'}
                </div>
            ) : (
                <>
                    {items.map((inv, idx) => (
                        <HoldingsTableRow
                            key={inv.id || inv.schemeCode}
                            inv={inv}
                            idx={idx}
                            isLast={idx === items.length - 1}
                            isExpanded={expandedId === (inv.id || inv.schemeCode)}
                            onExpand={setExpandedId}
                            onNavigate={onNavigate}
                            returnType={returnType}
                        />
                    ))}

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
                            ₹{formatCurrency(items.reduce((s, i) => s + (i.amount ?? 0), 0), 0)}
                        </p>
                        <p style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: '#e8eaed', margin: 0 }}>
                            ₹{formatCurrency(items.reduce((s, i) => s + (i.amount ?? 0) + (i.profit ?? 0), 0), 0)}
                        </p>
                        <p style={{
                            textAlign: 'right', fontSize: 11, fontWeight: 700, margin: 0,
                            color: getPnlColor(items.reduce((s, i) => s + (i.profit ?? 0), 0)),
                        }}>
                            {(() => {
                                const tot = items.reduce((s, i) => s + (i.profit ?? 0), 0);
                                return `${tot >= 0 ? '+' : ''}₹${formatCurrency(Math.abs(tot), 1)}`;
                            })()}
                        </p>
                        <p style={{ margin: 0 }} />
                        <p style={{ margin: 0 }} />
                    </div>
                </>
            )}

            {!search && total > 0 && (
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
