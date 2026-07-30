import React from 'react';
import { Pagination } from '@shared/components/pagination/Pagination';
import stockCurrencyService from '@/shared/services/external/stock-currency.service';
import { OrderHistoryTableProps } from '../types/order-history.table';
import { OrderTypeBadge, SideTag, StatusBadge } from './HistoryTable';


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
                            <th className="text-xs font-semibold px-4 py-3 tracking-wider text-left align-middle">Asset</th>
                            <th className="text-xs font-semibold px-4 py-3 tracking-wider text-left align-middle">Side</th>
                            <th className="text-xs font-semibold px-4 py-3 tracking-wider text-left align-middle">Type</th>
                            <th className="text-xs font-semibold px-4 py-3 tracking-wider text-right align-middle">Quantity</th>
                            <th className="text-xs font-semibold px-4 py-3 tracking-wider text-right align-middle">Total</th>
                            <th className="text-xs font-semibold px-4 py-3 tracking-wider text-center align-middle">Status</th>
                            <th className="text-xs font-semibold px-4 py-3 tracking-wider text-right align-middle">Date</th>
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
                                    <td className="px-4 py-3 align-middle cursor-pointer" onClick={() => onNavigate(item.symbol)}>
                                        <div className="flex items-center gap-3">
                                            {item.logo ? (
                                                <img src={item.logo} alt={item.symbol} className="w-7 h-7 rounded border border-[#1e2025] bg-white object-contain shrink-0" />
                                            ) : (
                                                <div className="w-7 h-7 rounded bg-[#1a1c20] border border-[#1e2025] flex items-center justify-center font-bold text-[10px] shrink-0 text-[#e8eaed]">
                                                    {item.symbol.charAt(0)}
                                                </div>
                                            )}
                                            <div className="flex flex-col justify-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-[#e8eaed] leading-none">{item.symbol}</span>
                                                </div>
                                                <div className="text-xs text-[#5a5f6e] max-w-[150px] truncate leading-tight mt-1" title={item.name}>
                                                    {item.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Side column */}
                                    <td className="px-4 py-3 align-middle">
                                        <div className="flex items-center">
                                            <SideTag side={side} />
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 align-middle">
                                        <OrderTypeBadge type={item.orderType} isAlgo={item.isAlgoTrade} />
                                    </td>

                                    <td className="px-4 py-3 text-right align-middle">
                                        <div className="text-sm font-semibold text-[#e8eaed] tabular-nums leading-none">
                                            {item.filledQty}
                                        </div>
                                        <div className="text-xs text-[#5a5f6e] mt-1 leading-none">shares</div>
                                    </td>

                                    <td className="px-4 py-3 text-right align-middle">
                                        <div className="text-sm font-semibold text-[#e8eaed] tabular-nums leading-none">
                                            {stockCurrencyService.formatCurrency(tradeValue, 'INR')}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-center align-middle">
                                        <StatusBadge status={item.status} />
                                    </td>

                                    {/* Date column */}
                                    <td className="px-4 py-3 text-right align-middle whitespace-nowrap">
                                        {tradeDate ? (
                                            <div className="flex flex-col items-end gap-0.5">
                                                <span className="text-xs text-[#9ca3af] tabular-nums leading-none">
                                                    {tradeDate.getDate().toString().padStart(2, '0')}{' '}
                                                    {tradeDate.toLocaleString('en-IN', { month: 'short' })}{' '}
                                                    '{tradeDate.getFullYear().toString().slice(2)}
                                                </span>
                                                <span className="text-[11px] text-[#5a5f6e] tabular-nums leading-none">
                                                    {tradeDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-[#5a5f6e]">—</span>
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
