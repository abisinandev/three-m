import { TABLE_HEADERS } from '../constants/portfolio.constants';
import { formatCurrency } from '../utils/portfolio.utils';
import { Pagination } from '@shared/components/pagination/Pagination';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TradeHistoryItem {
    id: string;
    side: string;
    totalAmount: number;
    price: number;
    quantity: number;
    date?: string;
    createdAt?: string;
    assetType?: string;
    assetName?: string;
    symbol?: string;
    assetId?: string;
    orderType?: string;
    exchange?: string;
    productType?: string;
    triggerPrice?: number;
}

interface TradeHistoryTableProps {
    data: TradeHistoryItem[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
}

const SideTag = ({ side }: { side?: string }) => {
    const isSell = side?.toLowerCase() === 'sell';
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 9, fontWeight: 800,
            padding: '2px 7px', borderRadius: 4,
            background: isSell ? 'rgba(255,23,68,0.12)' : 'rgba(0,200,83,0.12)',
            color: isSell ? '#FF1744' : '#00C853',
            border: isSell ? '1px solid rgba(255,23,68,0.2)' : '1px solid rgba(0,200,83,0.2)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            flexShrink: 0,
        }}>
            {isSell
                ? <ArrowUpRight size={9} />
                : <ArrowDownLeft size={9} />
            }
            {side || '—'}
        </div>
    );
};

const OrderTypeBadge = ({ type }: { type?: string }) => {
    if (!type) return null;
    return (
        <span style={{
            fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
            background: 'rgba(90,95,110,0.15)', color: '#9ca3af',
            border: '1px solid rgba(90,95,110,0.2)', textTransform: 'uppercase',
            letterSpacing: '0.05em',
        }}>
            {type}
        </span>
    );
};

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
            <div style={{
                padding: '40px 0', textAlign: 'center', fontSize: 12, color: '#5a5f6e',
                background: '#111214', border: '1px solid #1e2025', borderRadius: 8,
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        border: '2px solid #1e2025', borderTopColor: '#00C853',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    <span>Loading trade history…</span>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 8, overflow: 'hidden' }}>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 90px 110px 120px 110px 14px',
                gap: 8,
                padding: '8px 16px',
                borderBottom: '1px solid #1e2025',
                background: '#0e1014',
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
                <div style={{ padding: '48px 0', textAlign: 'center', fontSize: 12, color: '#5a5f6e' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
                    No transaction history found
                </div>
            ) : (
                <>
                    {data.map((item, idx) => {
                        const side = item.side || 'BUY';
                        const isSell = side.toLowerCase() === 'sell' || side.toLowerCase() === 'redeemed';
                        const tradeValue = item.totalAmount || (item.price ?? 0) * (item.quantity ?? 0);
                        const tradeDate = item.date ? new Date(item.date) : (item.createdAt ? new Date(item.createdAt) : null);
                        const assetType = item.assetType || 'STOCK';

                        return (
                            <div
                                key={item.id || idx}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 90px 110px 120px 110px 14px',
                                    gap: 8,
                                    padding: '11px 16px',
                                    borderBottom: idx < data.length - 1 ? '1px solid #1a1c20' : 'none',
                                    transition: 'background 0.12s',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#13151a'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                    <SideTag side={side} />
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <p style={{
                                                fontSize: 13, fontWeight: 600, color: '#e8eaed', margin: 0,
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                maxWidth: 160,
                                            }}>
                                                {item.assetName || item.symbol || item.assetId || '—'}
                                            </p>
                                            {assetType === 'STOCK' && <OrderTypeBadge type={item.orderType || 'MARKET'} />}
                                            {assetType === 'MF' && <OrderTypeBadge type="MF" />}
                                        </div>
                                        <p style={{ fontSize: 10, color: '#5a5f6e', margin: '2px 0 0' }}>
                                            {assetType === 'STOCK' ? (item.exchange || 'NSE') : 'Mutual Fund'}
                                            {item.productType ? ` · ${item.productType}` : ''}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#e8eaed', margin: 0 }}>
                                        {item.quantity ?? '—'}
                                    </p>
                                    <p style={{ fontSize: 10, color: '#5a5f6e', margin: '2px 0 0' }}>{assetType === 'STOCK' ? 'shares' : 'units'}</p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#e8eaed', margin: 0 }}>
                                        ₹{formatCurrency(item.price, 2)}
                                    </p>
                                    {item.triggerPrice && (
                                        <p style={{ fontSize: 10, color: '#5a5f6e', margin: '2px 0 0' }}>
                                            Trig: ₹{formatCurrency(item.triggerPrice, 2)}
                                        </p>
                                    )}
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p style={{
                                        fontSize: 12, fontWeight: 700, margin: 0,
                                        color: isSell ? '#FF1744' : '#00C853',
                                    }}>
                                        {isSell ? '-' : '+'}₹{formatCurrency(tradeValue, 2)}
                                    </p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    {tradeDate ? (
                                        <>
                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                                                {tradeDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                            </p>
                                            <p style={{ fontSize: 10, color: '#5a5f6e', margin: '2px 0 0' }}>
                                                {tradeDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </>
                                    ) : (
                                        <p style={{ fontSize: 11, color: '#5a5f6e', margin: 0 }}>—</p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    {isSell
                                        ? <ArrowUpRight size={12} color="#FF1744" />
                                        : <ArrowDownLeft size={12} color="#00C853" />
                                    }
                                </div>
                            </div>
                        );
                    })}

                    <div style={{
                        padding: '10px 16px',
                        borderTop: '1px solid #1e2025',
                        background: '#0e1014',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <p style={{ fontSize: 11, color: '#5a5f6e', margin: 0 }}>
                            {data.length} transaction{data.length !== 1 ? 's' : ''} on this page
                        </p>
                        <p style={{ fontSize: 11, color: '#5a5f6e', margin: 0 }}>
                            Total value: <span style={{ color: '#e8eaed', fontWeight: 600 }}>
                                ₹{formatCurrency(data.reduce((s, t) => s + (t.price ?? 0) * (t.quantity ?? 0), 0), 2)}
                            </span>
                        </p>
                    </div>

                    {total > limit && (
                        <div style={{ borderTop: '1px solid #1e2025' }}>
                            <Pagination
                                page={page}
                                limit={limit}
                                total={total}
                                onPageChange={onPageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
