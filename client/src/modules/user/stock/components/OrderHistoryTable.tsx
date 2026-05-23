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
            {isSell ? <ArrowUpRight size={9} /> : <ArrowDownLeft size={9} />}
            {side || '—'}
        </div>
    );
};

const OrderTypeBadge: React.FC<{ type?: string; isAlgo?: boolean }> = ({ type, isAlgo }) => {
    if (!type) return null;
    return (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{
                fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                background: 'rgba(90,95,110,0.15)', color: '#9ca3af',
                border: '1px solid rgba(90,95,110,0.2)', textTransform: 'uppercase',
                letterSpacing: '0.05em',
            }}>
                {type.replace('_', ' ')}
            </span>
            {isAlgo && (
                <span style={{
                    fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                    background: 'rgba(41,98,255,0.15)', color: '#2962ff',
                    border: '1px solid rgba(41,98,255,0.2)', textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}>
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
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 9, fontWeight: 700,
            padding: '2px 7px', borderRadius: 4,
            background: bg, color: color, border: border,
            textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
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
                            <th style={{ fontSize: 10, fontWeight: 600, padding: '10px 16px', letterSpacing: '0.06em' }}>Asset</th>
                            <th style={{ fontSize: 10, fontWeight: 600, padding: '10px 16px', letterSpacing: '0.06em' }}>Side</th>
                            <th style={{ fontSize: 10, fontWeight: 600, padding: '10px 16px', letterSpacing: '0.06em' }}>Type</th>
                            <th style={{ fontSize: 10, fontWeight: 600, padding: '10px 16px', letterSpacing: '0.06em', textAlign: 'right' }}>Quantity</th>
                            <th style={{ fontSize: 10, fontWeight: 600, padding: '10px 16px', letterSpacing: '0.06em', textAlign: 'right' }}>Price</th>
                            <th style={{ fontSize: 10, fontWeight: 600, padding: '10px 16px', letterSpacing: '0.06em', textAlign: 'right' }}>Total Value</th>
                            <th style={{ fontSize: 10, fontWeight: 600, padding: '10px 16px', letterSpacing: '0.06em', textAlign: 'center' }}>Status</th>
                            <th style={{ fontSize: 10, fontWeight: 600, padding: '10px 16px', letterSpacing: '0.06em', textAlign: 'right' }}>Date</th>
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
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e8eaed' }}>{item.symbol}</span>
                                                </div>
                                                <div style={{ fontSize: 10, color: '#5a5f6e' }} className="max-w-[150px] truncate" title={item.name}>
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

                                    {/* Type column */}
                                    <td className="px-4 py-3">
                                        <OrderTypeBadge type={item.orderType} isAlgo={item.isAlgoTrade} />
                                    </td>

                                    {/* Quantity column */}
                                    <td className="px-4 py-3 text-right">
                                        <div style={{ fontSize: 12, fontWeight: 600, color: '#e8eaed' }}>
                                            {item.filledQty}
                                        </div>
                                        <p style={{ fontSize: 10, color: '#5a5f6e', margin: '2px 0 0' }}>shares</p>
                                    </td>

                                    {/* Price column */}
                                    <td className="px-4 py-3 text-right font-medium">
                                        <div style={{ fontSize: 12, fontWeight: 600, color: '#e8eaed' }}>
                                            {stockCurrencyService.formatCurrency(price, 'INR')}
                                        </div>
                                        {item.limitPrice && item.limitPrice > 0 && (
                                            <p style={{ fontSize: 10, color: '#5a5f6e', margin: '2px 0 0' }}>
                                                Limit: {stockCurrencyService.formatCurrency(item.limitPrice, 'INR')}
                                            </p>
                                        )}
                                    </td>

                                    {/* Total Value column */}
                                    <td className="px-4 py-3 text-right">
                                        <div style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: side.toLowerCase() === 'sell' ? '#FF1744' : '#00C853'
                                        }}>
                                            {side.toLowerCase() === 'sell' ? '-' : '+'}
                                            {stockCurrencyService.formatCurrency(tradeValue, 'INR')}
                                        </div>
                                    </td>

                                    {/* Status column */}
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge status={item.status} />
                                    </td>

                                    {/* Date column */}
                                    <td className="px-4 py-3 text-right">
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
