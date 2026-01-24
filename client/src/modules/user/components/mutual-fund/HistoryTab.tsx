import React, { useState, useMemo } from 'react';
import { History, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import dayjs from 'dayjs';

interface HistoryTabProps {
    investmentsLoading: boolean;
    investments: any[];
}

const HistoryTab: React.FC<HistoryTabProps> = ({
    investmentsLoading,
    investments
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredInvestments = useMemo(() => {
        return investments.filter(tx => {
            const matchesSearch = tx.investmentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tx.schemeName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'All' || tx.investmentType === filterType;
            return matchesSearch && matchesType;
        });
    }, [investments, searchTerm, filterType]);

    const totalPages = Math.ceil(filteredInvestments.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredInvestments.slice(start, start + itemsPerPage);
    }, [filteredInvestments, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-base font-semibold flex items-center gap-2.5">
                    <History size={18} className="text-green-400" />
                    Investments History
                </h3>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search..."
                            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-green-600/50 w-full sm:w-40"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-green-600/50"
                    >
                        <option value="All">All Types</option>
                        <option value="SIP">SIP</option>
                        <option value="Lumpsum">One-time</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {investmentsLoading ? (
                    <div className="py-12 text-center text-gray-500 text-sm">Loading transactions...</div>
                ) : filteredInvestments.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 text-sm">No transactions found</div>
                ) : (
                    <>
                        <div className="divide-y divide-[#1f1f1f]">
                            {paginatedData.map((tx: any) => (
                                <div key={tx.id} className="py-3 flex justify-between items-center text-sm group hover:bg-[#1a1a1a]/50 px-2 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${tx.paymentMethod === 'Debit' ? 'bg-red-950/20' : 'bg-green-950/20'}`}>
                                            <History size={14} className={tx.paymentMethod === 'Debit' ? 'text-red-400' : 'text-green-400'} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-200">{tx.investmentType || 'Investment'}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{dayjs(tx.createdAt).format('DD MMM YYYY, hh:mm A')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${tx.paymentMethod === 'Debit' ? 'text-red-400' : 'text-green-400'}`}>
                                            {tx.paymentMethod === 'Debit' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-gray-500">{tx.paymentStatus || 'Completed'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-[#1f1f1f]">
                                <p className="text-xs text-gray-500">
                                    Showing <span className="text-gray-300">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-300">{Math.min(currentPage * itemsPerPage, filteredInvestments.length)}</span> of <span className="text-gray-300">{filteredInvestments.length}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`w-7 h-7 flex items-center justify-center rounded text-xs transition-colors ${currentPage === i + 1
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default HistoryTab;
