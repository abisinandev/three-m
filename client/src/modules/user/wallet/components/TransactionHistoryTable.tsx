import React from 'react';
import type { WalletTransaction } from '../types/wallet.types';
interface TransactionHistoryTableProps {
    transactions: WalletTransaction[];
}

const fmt = (v: number | string | undefined | null, digits = 2) => {
    if (v === undefined || v === null || isNaN(Number(v))) return '0.00';
    return Number(v).toLocaleString('en-IN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
};

const getStatusStyle = (status: string = '') => {
    const s = status.toUpperCase();
    if (s === 'SUCCESSFUL')
        return { color: '#00C853', bg: 'rgba(0,200,83,0.1)', border: 'rgba(0,200,83,0.2)' };
    if (s === 'PENDING')
        return { color: '#FFB300', bg: 'rgba(255,179,0,0.1)', border: 'rgba(255,179,0,0.2)' };
    if (s === 'FAILED')
        return { color: '#FF1744', bg: 'rgba(255,23,68,0.1)', border: 'rgba(255,23,68,0.2)' };
    return { color: '#5a5f6e', bg: 'rgba(90,95,110,0.1)', border: 'rgba(90,95,110,0.2)' };
};

const TransactionStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const style = getStatusStyle(status);
    return (
        <span
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border"
            style={{ color: style.color, backgroundColor: style.bg, borderColor: style.border }}
        >
            {status}
        </span>
    );
};

export const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({ transactions }) => {
    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg overflow-hidden shadow-sm">
            {transactions.length === 0 ? (
                <div className="py-20 text-center">
                    <p className="text-[12px] text-[#5a5f6e] uppercase tracking-tight">No audit data discovered.</p>
                </div>
            ) : (
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#111214] border-b border-[#1e2025]">
                            <tr className="text-[10px] font-semibold text-[#5a5f6e] uppercase tracking-wider">
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Reference</th>
                                <th className="px-5 py-3">Timestamp</th>
                                <th className="px-5 py-3 text-right">Credit/Debit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e2025] bg-[#111214]">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/[0.015] transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <TransactionStatusBadge status={tx.status} />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-bold text-[#e8eaed] uppercase tracking-tight">
                                                {(() => {
                                                    switch (tx.type) {
                                                        case 'TOPUP': return 'Wallet Deposit';
                                                        case 'WITHDRAW': return 'Withdrawal Request';
                                                        case 'SUBSCRIPTION': return 'Premium Upgrade';
                                                        case 'INVESTMENT': return 'Investement';
                                                        case 'REDEMPTION': return 'Profit Redemption';
                                                        case 'BUY': return 'Stock Buy';
                                                        case 'SELL': return 'Stock Sell';
                                                        case 'SIP_INSTALLMENT': return 'SIP Installment';
                                                        default: return tx.type || 'Transaction';
                                                    }
                                                })()}
                                            </span>
                                            <span className="text-[10px] text-[#5a5f6e] font-mono mt-0.5">
                                                REF: {tx.transactionId || '---'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-[11px] text-[#5a5f6e] font-medium">
                                            {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })} · {new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <span className={`text-[13px] font-bold font-mono ${tx.type === 'TOPUP' || tx.type === 'REDEMPTION' || tx.type === 'SELL' ? 'text-emerald-400' : 'text-[#e8eaed]/60'}`}>
                                            {tx.type === 'TOPUP' || tx.type === 'REDEMPTION' || tx.type === 'SELL' ? '+' : '-'} ₹{fmt(tx.amount)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
