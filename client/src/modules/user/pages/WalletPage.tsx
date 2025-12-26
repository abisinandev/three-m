import { useState } from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    ChevronRight,
    AlertTriangle,
    ChevronLeft,
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

export type WalletTransaction = {
    id: string;
    userId: string;
    userCode: string;
    transactionId: string;
    amount: number;
    currency: 'inr';
    isVerified: boolean;
    paymentIntentId: string;
    referenceType: 'STRIPE';
    status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
    paymentStatus: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
    type: 'TOPUP' | 'WITHDRAW';
    fundId?: string;
    receipt_url: string;
    units?: number;
    createdAt: string | Date;
};

export type UserWalletResponse = {
    id: string;
    userId: string;
    balance: number;
    currency: 'inr';
    status: 'ACTIVE' | 'INACTIVE' | 'FROZEN';
    createdAt: string;
    updatedAt: string;
    transactions: WalletTransaction[];
};


const KycWarningBox = ({
    title = 'KYC verification required',
    message = 'Please complete your KYC to access wallet features.',
    actionText = 'Complete KYC',
    redirectTo = '/user/profile',
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

const WalletIntegrityAlert = ({
    title = 'Wallet temporarily restricted',
    message = 'We detected an inconsistency in your wallet. Please contact support.',
}: {
    title?: string;
    message?: string;
}) => {
    return (
        <div className="flex items-start gap-3 bg-red-900/30 border border-red-700/40 rounded-xl p-4">
            <AlertTriangle className="text-red-400 mt-0.5" size={18} />
            <div className="flex-1">
                <p className="text-sm font-medium text-red-300">{title}</p>
                <p className="text-xs text-red-200 mt-1">{message}</p>
            </div>
        </div>
    );
};


const Pagination = ({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded bg-gray-800 disabled:opacity-50"
            >
                <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
            </span>

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded bg-gray-800 disabled:opacity-50"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};


const WalletPage = () => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const { user } = useUserStore();

    const { data, refetch, isFetching } = useQuery<UserWalletResponse | any>({
        queryKey: ['user-wallet-data'],
        queryFn: FetchUserWallet,
        placeholderData: keepPreviousData,
    });

    const wallet = data?.data?.data;
    const balance = wallet?.balance ?? 0;
    const walletStatus = wallet?.status ?? 'INACTIVE';

    const isWalletFrozen = walletStatus === 'FROZEN';
    const isVerified = user?.isVerified ?? false;

    const canTransact = isVerified && !isWalletFrozen;

    const allTransactions = wallet?.transactions ?? [];
    const totalPages = Math.ceil(allTransactions.length / itemsPerPage);

    const paginatedTransactions = allTransactions.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const formatAmount = (value: number) =>
        new Intl.NumberFormat('en-IN').format(value);

    const getTransactionType = (tx: WalletTransaction) =>
        tx.type === 'TOPUP' ? 'Topup' : 'Withdraw';


    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

            {!isVerified && <KycWarningBox />}

            {isWalletFrozen && <WalletIntegrityAlert />}

            {/* Wallet Balance */}
            <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-gray-400">Wallet Balance</p>
                        <p className="text-3xl font-semibold mt-1">
                            ₹{formatAmount(balance)}
                        </p>

                        {isWalletFrozen && (
                            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                <AlertTriangle size={12} />
                                Wallet is frozen
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-2 rounded-lg hover:bg-[#1a1a1a] disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`}
                        />
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] p-6">
                <p className="text-xs text-gray-400 mb-4">Manage Funds</p>

                <div className="grid sm:grid-cols-2 gap-4">
                    <button
                        disabled={!canTransact}
                        onClick={() => navigate({ to: '/user/wallet/add-to-wallet' })}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium ${canTransact
                            ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a]'
                            : 'bg-[#222] text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <ArrowUpRight size={16} />
                        Add Money
                    </button>

                    <button
                        disabled={!canTransact}
                        onClick={() => navigate({ to: '/user/wallet/withdraw' })}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium ${canTransact
                            ? 'bg-[#111] border border-[#333]'
                            : 'bg-[#111] border border-[#222] text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <ArrowDownRight size={16} />
                        Withdraw Money
                    </button>
                </div>
            </div>

            <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] overflow-hidden">
                <div className="px-6 py-3 border-b border-[#1f1f1f]">
                    <p className="text-xs text-gray-400">Payment History</p>
                </div>

                {allTransactions.length === 0 && (
                    <div className="px-6 py-6 text-center text-xs text-gray-500">
                        No transactions found.
                    </div>
                )}

                {allTransactions.length > 0 && (
                    <>
                        <table className="w-full text-xs">
                            <tbody>
                                {paginatedTransactions.map((tx: any) => (
                                    <tr key={tx.id} className="border-b border-[#1a1a1a]">
                                        <td className="px-6 py-3">
                                            {new Date(tx.createdAt).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-3">
                                            {getTransactionType(tx)}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            ₹{formatAmount(tx.amount)}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            {tx.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default WalletPage;
