import { Trash2, Lock } from 'lucide-react';
import { Pagination } from '@shared/components/pagination/Pagination';
import { formatCurrency } from '@modules/user/helpers/expenseHelpers';
import { useDeleteExpenseMutation } from '@modules/user/hooks/useExpenseMutations';

interface TransactionTableProps {
    transactions: any[];
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

    const { mutate: deleteExpense } = useDeleteExpenseMutation();

    const handleDelete = (id: string) => {
        if (id.startsWith('exp-')) {
            const index = parseInt(id.split('-')[1]);
            if (!isNaN(index)) {
                deleteExpense(index);
            }
        }
    };

    const currentTransactions = transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <section className="bg-[#111] rounded-2xl border border-neutral-800/60 overflow-hidden">
            <div className="p-6 border-b border-neutral-800/60 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    Transactions History
                </h3>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wilder">
                    {totalTransactions} Records
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#161616]">
                        <tr className="text-left text-[10px] font-bold text-neutral-500 tracking-widest uppercase">
                            <th className="py-4 pl-6">Date</th>
                            <th className="py-4">Category</th>
                            <th className="py-4">Description</th>
                            <th className="py-4 text-right">Amount</th>
                            <th className="py-4 text-center pr-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                        {totalTransactions === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-neutral-600 text-xs italic">
                                    No transactions yet for {displayMonth}.
                                </td>
                            </tr>
                        ) : (
                            currentTransactions.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-[#161616] transition-colors text-xs font-medium text-neutral-300">

                                    <td className="py-4 pl-6 font-mono text-neutral-500">{tx.date}</td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase ${tx.category === 'NEED' ? 'bg-blue-500/10 text-blue-400' :
                                            tx.category === 'WANT' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-emerald-500/10 text-emerald-400'
                                            }`}>
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className="py-4 text-white">
                                        {tx.description}
                                        {'investmentType' in tx && tx.investmentType && (
                                            <span className="ml-2 text-[9px] text-neutral-500 border border-neutral-800 px-1 py-0.5 rounded">{tx.investmentType}</span>
                                        )}
                                    </td>
                                    <td className="py-4 text-right font-bold tabular-nums">
                                        {formatCurrency(tx.amount)}
                                    </td>
                                    <td className="py-4 text-center pr-4">
                                        {tx.type === 'expense' ? (
                                            <button
                                                onClick={() => handleDelete(tx.id)}
                                                className="p-2 rounded-md hover:bg-rose-500/10 text-neutral-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        ) : (
                                            <Lock size={12} className="mx-auto text-neutral-600 opacity-0 group-hover:opacity-50" />
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                page={currentPage}
                limit={itemsPerPage}
                total={totalTransactions}
                onPageChange={setCurrentPage}
            />
        </section>
    );
};
