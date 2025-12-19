import { useState } from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    ChevronRight,
    AlertTriangle
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { FetchUserWallet } from '@shared/services/user/FetchUserWallet';
import { useUserStore } from '@stores/user/UserStore';

type KycWarningBoxProps = {
    title?: string;
    message?: string;
    actionText?: string;
    redirectTo?: string;
};

const KycWarningBox = ({
    title = "KYC verification required",
    message = "Please complete your KYC to access wallet features.",
    actionText = "Complete KYC",
    redirectTo = "/user/profile",
}: KycWarningBoxProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-start gap-3 bg-yellow-900/30 border border-yellow-700/40 rounded-xl p-4">
            <AlertTriangle className="text-yellow-400 mt-0.5" size={18} />
            <div className="flex-1">
                <p className="text-sm font-medium text-yellow-300">{title}</p>
                <p className="text-xs text-yellow-200 mt-1">{message}</p>
            </div>
            <button
                onClick={() => navigate({ to: redirectTo })}
                className="text-xs bg-yellow-400 text-black px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition"
            >
                {actionText}
            </button>
        </div>
    );
};

const WalletPage = () => {
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { data } = useQuery({
        queryKey: ['user-wallet-data'],
        queryFn: async () => FetchUserWallet(),
        placeholderData: keepPreviousData,
    });

    const response = data?.data;
    const balance = response?.balance ?? 0;

    const isVerified = user?.isVerified ?? false;
    const transactions = response?.transactions ?? [];

    const formatAmount = (value: number) =>
        new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

            {!isVerified && <KycWarningBox />}

            <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-gray-400">Wallet Balance</p>
                        <p className="text-3xl font-semibold mt-1">
                            ₹{formatAmount(balance)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Last updated {response?.updatedAt ?? '—'}
                        </p>
                    </div>

                    <button
                        disabled={!isVerified}
                        className={`p-2 rounded-lg transition
                            ${isVerified ? 'hover:bg-[#1a1a1a]' : 'opacity-50 cursor-not-allowed'}
                        `}
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] p-6">
                <p className="text-xs text-gray-400 mb-4">Manage Funds</p>

                <div className="grid sm:grid-cols-2 gap-4">

                    <button
                        disabled={!isVerified}
                        onClick={() => navigate({ to: '/user/wallet/add-to-wallet' })}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition
                            ${isVerified
                                ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a] hover:opacity-90'
                                : 'bg-[#222] text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <ArrowUpRight size={16} />
                        Add Money
                    </button>

                    <button
                        disabled={!isVerified}
                        onClick={() => navigate({ to: '/user/wallet/withdraw' })}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition
                            ${isVerified
                                ? 'bg-[#111] border border-[#333] hover:bg-[#1a1a1a]'
                                : 'bg-[#111] border border-[#222] text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <ArrowDownRight size={16} />
                        Withdraw Money
                    </button>

                </div>
            </div>

            <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] overflow-hidden">
                <div className="flex justify-between items-center px-6 py-3 border-b border-[#1f1f1f]">
                    <p className="text-xs text-gray-400">Payment History</p>
                    <button className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
                        View all <ChevronRight size={12} />
                    </button>
                </div>

                {!isVerified && (
                    <div className="px-6 py-6 text-center text-xs text-gray-500">
                        Transaction history available after KYC verification.
                    </div>
                )}

                {isVerified && transactions.length === 0 && (
                    <div className="px-6 py-6 text-center text-xs text-gray-500">
                        No transactions found.
                    </div>
                )}
                {isVerified && transactions.length > 0 && (
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
                            {transactions.map((tx: any) => {
                                const isCredit = tx._type === 'WALLET_TOP_UP';

                                return (
                                    <tr
                                        key={tx._id}
                                        className="border-b border-[#1a1a1a] hover:bg-[#111] transition"
                                    >
                                        <td className="px-6 py-3 text-gray-300">
                                            {new Date(tx._createdAt).toLocaleString('en-IN')}
                                        </td>

                                        <td className="px-6 py-3">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium
                                        ${isCredit
                                                        ? 'bg-green-900/30 text-green-400'
                                                        : 'bg-red-900/30 text-red-400'
                                                    }`}
                                            >
                                                {tx._type.replace(/_/g, ' ').toLowerCase()}
                                            </span>
                                        </td>

                                        <td
                                            className={`px-6 py-3 text-right font-medium
                                    ${isCredit ? 'text-green-400' : 'text-red-400'}
                                `}
                                        >
                                            {isCredit ? '+' : '-'}₹{tx._amount}
                                        </td>

                                        <td className="px-6 py-3 text-right">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium
                                        ${tx._status === 'SUCCESSFUL'
                                                        ? 'bg-green-900/30 text-green-400'
                                                        : tx._status === 'PENDING'
                                                            ? 'bg-yellow-900/30 text-yellow-400'
                                                            : 'bg-red-900/30 text-red-400'
                                                    }`}
                                            >
                                                {tx._status.toLowerCase()}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};

export default WalletPage;
