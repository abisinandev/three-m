import { TABLE_HEADERS } from '../constants/portfolio.constants';
import { TradeHistoryTableProps } from '../types/portfolio-types';
import { formatCurrency } from '../utils/portfolio.utils';
import { Pagination } from '@shared/components/pagination/Pagination';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';


const SideTag = ({ side }: { side?: string }) => {
    const isSell = side?.toLowerCase() === 'sell';
    return (
        <div className={`flex items-center gap-1 text-xs font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${isSell ? 'bg-red-500/10 text-[#FF1744] border-red-500/20' : 'bg-emerald-500/10 text-[#00C853] border-emerald-500/20'}`}>
            {isSell
                ? <ArrowUpRight size={10} />
                : <ArrowDownLeft size={10} />
            }
            {side || '—'}
        </div>
    );
};

const OrderTypeBadge = ({ type }: { type?: string }) => {
    if (!type) return null;
    return (
        <span className="text-xs font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider bg-[#5a5f6e]/15 text-[#9ca3af] border-[#5a5f6e]/20">
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
            <div className="py-10 text-center text-sm text-[#5a5f6e] bg-[#111214] border border-[#1e2025] rounded-lg">
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
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg overflow-hidden">

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 90px 110px 120px 110px 14px',
                gap: 8,
                padding: '8px 16px',
                borderBottom: '1px solid #1e2025',
                background: '#0e1014',
            }}>
                {TABLE_HEADERS.history.map((h, i) => (
                    <p key={i} className={`text-xs font-semibold text-[#5a5f6e] tracking-wider uppercase m-0 ${i > 0 ? 'text-right' : 'text-left'}`}>{h}</p>
                ))}
            </div>

            {!data || data.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#5a5f6e]">
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
                                            <p className="text-sm font-semibold text-[#e8eaed] m-0 overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]">
                                                {item.assetName || item.symbol || item.assetId || '—'}
                                            </p>
                                            {assetType === 'STOCK' && <OrderTypeBadge type={item.orderType || 'MARKET'} />}
                                            {assetType === 'MF' && <OrderTypeBadge type="MF" />}
                                        </div>
                                        <p className="text-xs text-[#5a5f6e] m-0 mt-0.5">
                                            {assetType === 'STOCK' ? (item.exchange || 'NSE') : 'Mutual Fund'}
                                            {item.productType ? ` · ${item.productType}` : ''}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p className="text-sm font-semibold text-[#e8eaed] m-0 tabular-nums">
                                        {item.quantity ?? '—'}
                                    </p>
                                    <p className="text-xs text-[#5a5f6e] m-0 mt-0.5">{assetType === 'STOCK' ? 'shares' : 'units'}</p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p className="text-sm font-semibold text-[#e8eaed] m-0 tabular-nums">
                                        ₹{formatCurrency(item.price, 2)}
                                    </p>
                                    {item.triggerPrice && (
                                        <p className="text-xs text-[#5a5f6e] m-0 mt-0.5 tabular-nums">
                                            Trig: ₹{formatCurrency(item.triggerPrice, 2)}
                                        </p>
                                    )}
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p className="text-sm font-bold text-[#e8eaed] m-0 tabular-nums">
                                        ₹{formatCurrency(tradeValue, 2)}
                                    </p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    {tradeDate ? (
                                        <>
                                            <p className="text-xs text-[#9ca3af] m-0 tabular-nums">
                                                {tradeDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                            </p>
                                            <p className="text-xs text-[#5a5f6e] m-0 mt-0.5 tabular-nums">
                                                {tradeDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-xs text-[#5a5f6e] m-0">—</p>
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

                    <div className="py-2.5 px-4 border-t border-[#1e2025] bg-[#0e1014] flex justify-between items-center">
                        <p className="text-xs text-[#5a5f6e] m-0">
                            {data.length} transaction{data.length !== 1 ? 's' : ''} on this page
                        </p>
                        <p className="text-xs text-[#5a5f6e] m-0">
                            Total value: <span className="text-[#e8eaed] font-semibold tabular-nums">
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
