import React, { useState } from "react";
import { format } from "date-fns";
import { Eye, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import type { Transaction } from "../types/transaction.types";

interface TransactionsTableProps {
    transactions: Transaction[];
    isLoading: boolean;
    isError: boolean;
    currentPage: number;
    limit: number;
    totalAmount: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
    transactions,
    isLoading,
    isError,
    currentPage,
    total,
    totalPages,
    onPageChange,
}) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="bg-[#121214] rounded-lg border border-neutral-800/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto min-h-[350px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800/80 bg-[#121214]">
                            <th className="px-5 py-2.5 text-[10px] text-neutral-500 font-medium tracking-wider uppercase">Tx ID</th>
                            <th className="px-5 py-2.5 text-[10px] text-neutral-500 font-medium tracking-wider uppercase">User</th>
                            <th className="px-5 py-2.5 text-[10px] text-neutral-500 font-medium tracking-wider uppercase">Type</th>
                            <th className="px-5 py-2.5 text-[10px] text-neutral-500 font-medium tracking-wider uppercase">Purpose</th>
                            <th className="px-5 py-2.5 text-[10px] text-neutral-500 font-medium tracking-wider uppercase">Amount</th>
                            <th className="px-5 py-2.5 text-[10px] text-neutral-500 font-medium tracking-wider uppercase">Status</th>
                            <th className="px-5 py-2.5 text-[10px] text-neutral-500 font-medium tracking-wider text-right uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#121214]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-16 text-center text-neutral-400 text-[12px]">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                        <span>Loading transactions...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-16 text-center text-red-400 text-[12px]">
                                    Failed to load transactions
                                </td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-16 text-center text-neutral-500 text-[12px]">
                                    No transactions found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => {
                                const isExpanded = expandedRow === tx.id;

                                return (
                                    <React.Fragment key={tx.id}>
                                        <tr className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors group">
                                            <td className="px-5 py-3">
                                                <div className="text-[10px] text-emerald-500/90 font-mono tracking-tight">{tx.transactionId}</div>
                                                <div className="text-[9px] text-neutral-600 truncate max-w-[80px]">{tx.id}</div>
                                            </td>
                                            <td className="px-5 py-3 text-[12px] text-neutral-300 font-medium">{tx.userCode}</td>
                                            <td className="px-5 py-3">
                                                <span className="text-[12px] text-white font-medium capitalize">{tx.type.toLowerCase().replace('_', ' ')}</span>
                                            </td>
                                            <td className="px-5 py-3 text-[12px] text-neutral-400 capitalize">
                                                {tx.referenceType?.toLowerCase() ?? "-"}
                                            </td>
                                            <td className="px-5 py-3 text-[12px] font-mono text-white">
                                                ₹{(tx.amount ?? 0).toLocaleString()}
                                            </td>
                                            <td className="px-5 py-3">
                                                <PaymentStatusBadge status={tx.status} />
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => toggleExpand(tx.id)}
                                                        className="p-1 px-2 bg-neutral-800/60 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded transition-colors border border-transparent hover:border-neutral-600 text-[11px]"
                                                    >
                                                        {isExpanded ? <ChevronUp size={12} /> : <Eye size={12} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={7} className="bg-black/20 px-5 py-3 border-b border-neutral-800/60">
                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                                        <div>
                                                            <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Details</p>
                                                            <div className="space-y-0.5">
                                                                <p className="text-[11px] text-neutral-300">Currency: <span className="text-white font-mono uppercase">{tx.currency}</span></p>
                                                                <p className="text-[11px] text-neutral-300">Created: <span className="text-neutral-400">{tx.createdAt ? format(new Date(tx.createdAt), "MMM dd, HH:mm:ss") : "-"}</span></p>
                                                            </div>
                                                        </div>
                                                        {tx.fundId && (
                                                            <div>
                                                                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Asset</p>
                                                                <p className="text-[11px] text-neutral-300">Fund ID: <span className="font-mono text-emerald-400/70">{tx.fundId}</span></p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-3 border-t border-neutral-800/80 flex justify-between items-center text-[11px] text-neutral-500 bg-[#121214]">
                <div className="font-medium bg-neutral-800/20 px-2 py-0.5 rounded text-[10px]">
                    Showing <span className="text-white">{transactions.length}</span> of <span className="text-white">{total}</span>
                </div>
                <div className="flex gap-1 items-center">
                    <span className="mr-2 text-[10px]">Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span></span>
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1 || isLoading}
                        className="p-1 bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded transition-all shadow-sm"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages || isLoading}
                        className="p-1 bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded transition-all shadow-sm"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
