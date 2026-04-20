import { useState, useMemo } from 'react';
import {
    ArrowUpRight,
    RefreshCw,
    ChevronRight,
    AlertTriangle,
    ChevronLeft,
    History,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { FetchUserWallet } from '@shared/services/user/FetchUserWallet';
import { useUserStore } from '@stores/user/UserStore';
import { ROUTES } from '@shared/constants/routes';


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
    type: 'TOPUP' | 'WITHDRAW';
    fundId?: string;
    receipt_url: string;
    units?: number;
    createdAt: string | Date;
};


const KycWarningBox = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-between gap-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2.5">
                <AlertTriangle className="text-yellow-500" size={16} />
                <p className="text-[12px] font-medium text-yellow-200/90">
                    KYC verification required for full access.
                </p>
            </div>
            <button
                onClick={() => navigate({ to: ROUTES.USER.PROFILE })}
                className="text-[11px] font-bold text-yellow-500 hover:text-yellow-400 uppercase tracking-wider"
            >
                Complete Now
            </button>
        </div>
    );
};

const WalletFrozenAlert = () => (
    <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
        <AlertTriangle size={16} />
        <p className="text-[12px] font-medium">Wallet restricted. Please contact support.</p>
    </div>
);

const TransactionStatus = ({ status }: { status: WalletTransaction['status'] }) => {
    const styles = {
        SUCCESSFUL: 'text-emerald-400',
        PENDING: 'text-amber-400',
        FAILED: 'text-rose-400',
    };
    return (
        <span className={`text-[10px] font-bold uppercase tracking-widest ${styles[status] || 'text-gray-400'}`}>
            {status}
        </span>
    );
};

const Pagination = ({ page, totalPages, onPageChange }: { page: number, totalPages: number, onPageChange: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.01]">
            <span className="text-[11px] text-white/30 truncate">
                Showing page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="p-1.5 rounded border border-white/10 text-white/40 disabled:opacity-20 hover:text-white transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="p-1.5 rounded border border-white/10 text-white/40 disabled:opacity-20 hover:text-white transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

const WalletPage = () => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 7;
    const navigate = useNavigate();
    const { user } = useUserStore();

    const { data, refetch, isFetching } = useQuery<any>({
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

    const allTransactions = useMemo(() => wallet?.transactions ?? [], [wallet]);
    const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
    const paginatedTransactions = useMemo(() =>
        allTransactions.slice((page - 1) * itemsPerPage, page * itemsPerPage),
        [allTransactions, page]
    );

    const formatAmount = (value: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(value);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

            {/* Minimalist Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-white/90 uppercase tracking-widest">My Wallet</h1>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className={`text-white/40 hover:text-white transition-colors ${isFetching ? 'animate-spin' : ''}`}
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Alerts */}
            <div className="space-y-2">
                {!isVerified && <KycWarningBox />}
                {isWalletFrozen && <WalletFrozenAlert />}
            </div>

            {/* Balance Card */}
            <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Total Balance</p>
                    <p className="text-5xl font-light text-white tracking-tighter">
                        {formatAmount(balance)}
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full max-w-sm">
                    <button
                        disabled={!canTransact}
                        onClick={() => navigate({ to: ROUTES.USER.WALLET.ADD })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${canTransact
                            ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                            : 'bg-white/5 text-white/10 cursor-not-allowed'
                            }`}
                    >
                        <ArrowUpRight size={16} />
                        Deposit
                    </button>
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 px-1">
                    <History size={14} className="text-white/20" />
                    <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Recent Activity</h2>
                </div>

                <div className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden shadow-sm">
                    {allTransactions.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-xs text-white/20">No transaction data available.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] border-b border-white/5">
                                    <tr className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Activity</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {paginatedTransactions.map((tx: WalletTransaction) => (
                                        <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                                            <td className="px-6 py-4">
                                                <TransactionStatus status={tx.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[12px] font-medium text-white/80">
                                                    {tx.type === 'TOPUP' ? 'Wallet Topup' : 'Withdrawal Request'}
                                                </p>
                                                <p className="text-[10px] text-white/30 mt-0.5 font-mono">
                                                    ID: {tx.transactionId?.slice(-8) || tx.id.slice(-8)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[11px] text-white/40">
                                                    {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <p className={`text-[13px] font-semibold ${tx.type === 'TOPUP' ? 'text-white' : 'text-white/50'}`}>
                                                    {tx.type === 'TOPUP' ? '+' : '-'}{formatAmount(tx.amount)}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(p) => {
                            setPage(p);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
