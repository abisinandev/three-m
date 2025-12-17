import { useState } from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import api from '@lib/axiosUser';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const WalletPage = () => {
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    };

    const { data } = useQuery({
        queryKey: ['user-wallet-data'],
        queryFn: async () => await api('/user/wallet'),
        placeholderData: keepPreviousData,
    });

    const response = data?.data;
    const balance = response?.data?.balance ?? 0;

    const transactions = [
        { date: '2025-09-25 09:50 AM IST', type: 'add', amount: 500, status: 'Completed' },
        { date: '2025-09-24 03:15 PM IST', type: 'withdraw', amount: 500, status: 'Processed' },
        { date: '2025-09-23 10:00 AM IST', type: 'add', amount: 1000, status: 'Pending' },
    ];

    const formatAmount = (value: number) =>
        new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

            {/* Balance Card */}
            <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-gray-400">Wallet Balance</p>
                        <p className="text-3xl font-semibold mt-1">
                            ₹{formatAmount(balance)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Last updated {response?.data?.updatedAt ?? '—'}
                        </p>
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="p-2 hover:bg-[#1a1a1a] rounded-lg transition"
                    >
                        <RefreshCw
                            size={16}
                            className={`text-gray-500 ${refreshing ? 'animate-spin' : ''}`}
                        />
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] p-6">
                <p className="text-xs text-gray-400 mb-4">Manage Funds</p>

                <div className="grid sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate({ to: '/user/wallet/add-to-wallet' })}
                        className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-sm font-medium hover:opacity-90 transition"
                    >
                        <ArrowUpRight size={16} />
                        Add Money
                    </button>

                    <button
                        onClick={() => navigate({ to: '/user/wallet/withdraw' })}
                        className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#111] border border-[#333] text-sm font-medium hover:bg-[#1a1a1a] transition"
                    >
                        <ArrowDownRight size={16} />
                        Withdraw Money
                    </button>
                </div>

                <div className="grid sm:grid-cols-2 mt-4 text-xs text-gray-500">
                    <span>Use wallet for SIPs & funds</span>
                    <span className="sm:text-right">Withdraw to bank account</span>
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] overflow-hidden">
                <div className="flex justify-between items-center px-6 py-3 border-b border-[#1f1f1f]">
                    <p className="text-xs text-gray-400">Payment History</p>
                    <button className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
                        View all <ChevronRight size={12} />
                    </button>
                </div>

                <table className="w-full text-xs">
                    <thead className="text-gray-500 border-b border-[#1f1f1f]">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Date</th>
                            <th className="px-6 py-3 text-left font-medium">Type</th>
                            <th className="px-6 py-3 text-right font-medium">Amount</th>
                            <th className="px-6 py-3 text-right font-medium">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((tx, i) => (
                            <tr key={i} className="border-b border-[#1a1a1a] hover:bg-[#111] transition">
                                <td className="px-6 py-3 text-gray-300">{tx.date}</td>
                                <td className="px-6 py-3 capitalize">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${tx.type === 'add'
                                            ? 'bg-green-900/30 text-green-400'
                                            : 'bg-red-900/30 text-red-400'}`}>
                                        {tx.type}
                                    </span>
                                </td>
                                <td className={`px-6 py-3 text-right font-medium
                  ${tx.type === 'add' ? 'text-green-400' : 'text-red-400'}`}>
                                    {tx.type === 'add' ? '+' : '-'}₹{formatAmount(tx.amount)}
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${tx.status === 'Completed'
                                            ? 'bg-green-900/30 text-green-400'
                                            : tx.status === 'Processed'
                                                ? 'bg-blue-900/30 text-blue-400'
                                                : 'bg-yellow-900/30 text-yellow-400'}`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="px-6 py-3 text-xs text-gray-500 flex justify-between">
                    <span>Showing 1–3 of 150</span>
                    <div className="flex gap-2">
                        <button className="px-2 py-0.5 rounded bg-[#22C55E] text-black">1</button>
                        <button className="px-2 py-0.5 rounded hover:bg-[#1a1a1a]">2</button>
                        <button className="px-2 py-0.5 rounded hover:bg-[#1a1a1a]">3</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
