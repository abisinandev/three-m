import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Pagination } from '@shared/components/pagination/Pagination';
import stockCurrencyService from '@/shared/services/external/stock-currency.service';
import type { OrderHistoryItem } from '@/shared/services/stock/fetch-stocks-api';

interface OrderHistoryTableProps {
    orders: OrderHistoryItem[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
    onNavigate: (symbol: string) => void;
}

const SideTag: React.FC<{ side?: string }> = ({ side }) => {
    const isSell = side?.toLowerCase() === 'sell';
    return (
        <div className={`flex items-center gap-1 text-xs font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${isSell ? 'bg-red-500/10 text-[#FF1744] border-red-500/20' : 'bg-emerald-500/10 text-[#00C853] border-emerald-500/20'}`}>
            {isSell ? <ArrowUpRight size={10} /> : <ArrowDownLeft size={10} />}
            {side || '—'}
        </div>
    );
};

const OrderTypeBadge: React.FC<{ type?: string; isAlgo?: boolean }> = ({ type, isAlgo }) => {
    if (!type) return null;
    return (
        <div className="flex gap-1 items-center">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider bg-[#5a5f6e]/15 text-[#9ca3af] border-[#5a5f6e]/20">
                {type.replace('_', ' ')}
            </span>
            {isAlgo && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider bg-[#2962ff]/15 text-[#2962ff] border-[#2962ff]/20">
                    ALGO
                </span>
            )}
        </div>
    );
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
    const s = status?.toUpperCase() || 'PENDING';
    let color = '#ffab00'; // Amber
    let bg = 'rgba(255,171,0,0.12)';
    let border = '1px solid rgba(255,171,0,0.2)';
    let icon = <Clock size={9} />;

    if (s === 'FILLED') {
        color = '#00C853'; // Emerald
        bg = 'rgba(0,200,83,0.12)';
        border = '1px solid rgba(0,200,83,0.2)';
        icon = <CheckCircle2 size={9} />;
    } else if (s === 'CANCELLED' || s === 'REJECTED') {
        color = '#FF1744'; // Rose
        bg = 'rgba(255,23,68,0.12)';
        border = '1px solid rgba(255,23,68,0.2)';
        icon = <XCircle size={9} />;
    }

    return (
        <div className={`inline-flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider`}
            style={{ color, background: bg, border }}>
            {icon}
            {s}
        </div>
    );
};

export const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({
    orders,
    total,
    page,
    limit,
    onPageChange,
    isLoading,
    onNavigate,
}) => {
    if (isLoading) {
        return (
            <div className="px-5 py-4 text-center">
                <div className="animate-pulse flex flex-col space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 bg-[#1a1c20] rounded w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-10 text-[#5a5f6e] text-sm bg-[#111214] border border-[#1e2025] rounded-lg">
                <div className="text-2xl mb-2">📋</div>
                No order history found.
            </div>
        );
    }

    return (
        <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 8, overflow: 'hidden' }}>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#1e2025] text-[#5a5f6e] uppercase tracking-widest bg-[#0e1014]">
                            <th className="text-xs font-semibold px-4 py-2.5 tracking-wider text-left">Asset</th>
                            <th className="text-xs font-semibold px-4 py-2.5 tracking-wider text-left">Side</th>
                            <th className="text-xs font-semibold px-4 py-2.5 tracking-wider text-left">Type</th>
                            <th className="text-xs font-semibold px-4 py-2.5 tracking-wider text-right">Quantity</th>
                            <th className="text-xs font-semibold px-4 py-2.5 tracking-wider text-right">Price</th>
                            <th className="text-xs font-semibold px-4 py-2.5 tracking-wider text-right">Total Value</th>
                            <th className="text-xs font-semibold px-4 py-2.5 tracking-wider text-center">Status</th>
                            <th className="text-xs font-semibold px-4 py-2.5 tracking-wider text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2025]">
                        {orders.map((item) => {
                            const side = item.side || 'BUY';
                            const price = item.executedPrice ?? item.price ?? 0;
                            const tradeValue = price * item.quantity;
                            const tradeDate = item.createdAt ? new Date(item.createdAt) : null;

                            return (
                                <tr key={item.id} className="hover:bg-[#15171a] transition-colors group">
                                    {/* Asset column */}
                                    <td className="px-4 py-3 cursor-pointer" onClick={() => onNavigate(item.symbol)}>
                                        <div className="flex items-center gap-3">
                                            {item.logo ? (
                                                <img src={item.logo} alt={item.symbol} className="w-7 h-7 rounded border border-[#1e2025] bg-white object-contain" />
                                            ) : (
                                                <div className="w-7 h-7 rounded bg-[#1a1c20] border border-[#1e2025] flex items-center justify-center font-bold text-[10px]">
                                                    {item.symbol.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-[#e8eaed]">{item.symbol}</span>
                                                </div>
                                                <div className="text-xs text-[#5a5f6e] max-w-[150px] truncate" title={item.name}>
                                                    {item.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Side column */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <SideTag side={side} />
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        <OrderTypeBadge type={item.orderType} isAlgo={item.isAlgoTrade} />
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <div className="text-sm font-semibold text-[#e8eaed] tabular-nums">
                                            {item.filledQty}
                                        </div>
                                        <p className="text-xs text-[#5a5f6e] mt-0.5">shares</p>
                                    </td>

                                    <td className="px-4 py-3 text-right font-medium">
                                        <div className="text-sm font-semibold text-[#e8eaed] tabular-nums">
                                            {stockCurrencyService.formatCurrency(price, 'INR')}
                                        </div>
                                        {item.limitPrice && item.limitPrice > 0 && (
                                            <p className="text-xs text-[#5a5f6e] mt-0.5 tabular-nums">
                                                Limit: {stockCurrencyService.formatCurrency(item.limitPrice, 'INR')}
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <div className="text-sm font-bold tabular-nums" style={{ color: side.toLowerCase() === 'sell' ? '#FF1744' : '#00C853' }}>
                                            {side.toLowerCase() === 'sell' ? '-' : '+'}
                                            {stockCurrencyService.formatCurrency(tradeValue, 'INR')}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge status={item.status} />
                                    </td>

                                    {/* Date column */}
                                    <td className="px-4 py-3 text-right">
                                        {tradeDate ? (
                                            <>
                                                <p className="text-xs text-[#9ca3af] m-0 tabular-nums">
                                                    {tradeDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                </p>
                                                <p className="text-xs text-[#5a5f6e] mt-0.5 tabular-nums">
                                                    {tradeDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-[#5a5f6e] m-0">—</p>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
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
        </div>
    );
};
