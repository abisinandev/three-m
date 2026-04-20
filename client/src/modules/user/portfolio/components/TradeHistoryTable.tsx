import React from 'react';
import { TABLE_HEADERS } from '../constants/portfolio.constants';
import { formatCurrency } from '../utils/portfolio.utils';
import { Pagination } from '@shared/components/pagination/Pagination';

interface TradeHistoryTableProps {
    data: any[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
}

export const TradeHistoryTable = ({
    data,
    total,
    page,
    limit,
    onPageChange,
    isLoading,
}: TradeHistoryTableProps) => {
    if (isLoading) {
        return (
            <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: '#5a5f6e', background: '#111214', border: '1px solid #1e2025', borderRadius: 8 }}>
                Loading trades…
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
                {TABLE_HEADERS.history.map((h, i) => (
                    <p key={i} style={{
                        fontSize: 10, fontWeight: 600, color: '#5a5f6e',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        textAlign: i > 0 ? 'right' : 'left', margin: 0,
                    }}>{h}</p>
                ))}
            </div>

            {!data || data.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: '#5a5f6e' }}>
                    No trade history yet
                </div>
            ) : (
                <>
                    {data.map((trade: any, idx: number) => (
                        <div key={trade.id || idx} style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 100px 110px 120px 110px 14px',
                            gap: 8,
                            padding: '11px 16px',
                            borderBottom: idx < data.length - 1 ? '1px solid #1a1c20' : 'none',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                                    background: trade.side?.toLowerCase() === 'sell' ? 'rgba(255,23,68,0.1)' : 'rgba(0,200,83,0.1)',
                                    color: trade.side?.toLowerCase() === 'sell' ? '#FF1744' : '#00C853',
                                    textTransform: 'uppercase'
                                }}>
                                    {trade.side}
                                </div>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e8eaed', margin: 0 }}>{trade.symbol}</p>
                                    <p style={{ fontSize: 10, color: '#5a5f6e', margin: 0 }}>{trade.orderType || 'Market'}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: 12, color: '#e8eaed' }}>{trade.quantity}</div>
                            <div style={{ textAlign: 'right', fontSize: 12, color: '#e8eaed' }}>₹{formatCurrency(trade.price, 2)}</div>
                            <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#e8eaed' }}>₹{formatCurrency(trade.price * trade.quantity, 2)}</div>
                            <div style={{ textAlign: 'right', fontSize: 11, color: '#5a5f6e' }}>
                                {new Date(trade.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </div>
                            <div />
                        </div>
                    ))}

                    <div style={{ borderTop: '1px solid #1e2025' }}>
                        <Pagination
                            page={page}
                            limit={limit}
                            total={total}
                            onPageChange={onPageChange}
                        />
                    </div>
                </>
            )}
        </div>
    );
};
