'use client';

import { formatCurrency } from "../helpers/expense-helpers";

interface Transaction {
    id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
}

interface TransactionTableProps {
    transactions: Transaction[];
    currentPage: number;
    itemsPerPage: number;
    totalTransactions: number;
    setCurrentPage: (page: number) => void;
    displayMonth: string;
}

export const TransactionTable = ({
    transactions,
    currentPage,
    itemsPerPage,
    totalTransactions,
    setCurrentPage,
    displayMonth
}: TransactionTableProps) => {
    
    // Pagination logic
    const totalPages = Math.ceil(totalTransactions / itemsPerPage);
    const paginatedTransactions = transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'NEED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'WANT': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'SAVING': return 'text-[#00C853] bg-[#00C853]/10 border-[#00C853]/20';
            default: return 'text-[#5a5f6e] bg-[#5a5f6e]/10 border-[#5a5f6e]/20';
        }
    };

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="grid grid-cols-[100px_100px_1fr_120px] gap-3 px-4 py-2.5 border-b border-[#1e2025] bg-[#0e1014]">
                {['DATE', 'TYPE', 'DESCRIPTION', 'AMOUNT'].map((h, i) => (
                    <p key={h} className={`text-[9px] font-bold text-[#5a5f6e] tracking-[0.08em] m-0 ${i === 3 ? 'text-right' : 'text-left'}`}>
                        {h}
                    </p>
                ))}
            </div>


            {/* List */}
            <div className="min-h-[100px]">
                {paginatedTransactions.length === 0 ? (
                    <div className="py-10 text-center text-[11px] text-[#5a5f6e]">
                        No transactions found for {displayMonth}
                    </div>
                ) : (
                    paginatedTransactions.map((tx, idx) => (
                        <div 
                            key={tx.id} 
                            className={`grid grid-cols-[100px_100px_1fr_120px] gap-3 px-4 py-3 transition-colors duration-200 cursor-default hover:bg-[#16181d] ${idx === paginatedTransactions.length - 1 ? 'border-none' : 'border-b border-[#16181d]'} ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}
                        >
                            <p className="text-[10px] text-gray-400 font-medium m-0">{tx.date}</p>
                            <div>
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${getCategoryStyles(tx.category)}`}>
                                    {tx.category}
                                </span>
                            </div>
                            <p className="text-[11px] text-[#e8eaed] font-semibold m-0 capitalize">{tx.description}</p>
                            <p className={`text-[11px] font-bold text-right m-0 ${tx.type === 'income' ? 'text-[#00C853]' : 'text-[#e8eaed]'}`}>
                                {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                            </p>
                        </div>
                    )) 
                )}
            </div>


            {/* Pagination / Total info */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center px-4 py-3 border-t border-[#1e2025] bg-[#0e1014]">
                    <p className="text-[10px] text-[#5a5f6e] font-semibold m-0">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className={`border-none rounded bg-[#1e2025] text-[#e8eaed] text-[9px] font-bold px-2.5 py-1 ${currentPage === 1 ? 'cursor-default opacity-30' : 'cursor-pointer opacity-100'}`}
                        >
                            PREV
                        </button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className={`border-none rounded bg-[#1e2025] text-[#e8eaed] text-[9px] font-bold px-2.5 py-1 ${currentPage === totalPages ? 'cursor-default opacity-30' : 'cursor-pointer opacity-100'}`}
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
};
