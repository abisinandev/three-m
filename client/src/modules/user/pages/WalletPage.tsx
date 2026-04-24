import { useState, useMemo } from 'react';
import { RefreshCw, History } from 'lucide-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { FetchUserWallet } from '@shared/services/user/FetchUserWallet';
import { useUserStore } from '@stores/user/UserStore';
import { Pagination } from '@shared/components/pagination/Pagination';

import { KycWarningBox, WalletFrozenAlert } from '../components/wallet/WalletAlerts';
import { WalletBalanceBar } from '../components/wallet/WalletBalanceBar';
import { TransactionHistoryTable } from '../components/wallet/TransactionHistoryTable';
import type { WalletResponse, WalletTransaction } from '../types/wallet.types';

const WalletPage = () => {
    const [page, setPage] = useState(1);
    const limit = 8;
    const { user } = useUserStore();

    const { data, refetch, isFetching } = useQuery<WalletResponse>({
        queryKey: ['user-wallet-data'],
        queryFn: FetchUserWallet as any,
        placeholderData: keepPreviousData,
    });

    const wallet = data?.data?.data;
    const balance = wallet?.balance ?? 0;
    const walletStatus = wallet?.status ?? 'INACTIVE';
    const isWalletFrozen = walletStatus === 'FROZEN';
    const isVerified = user?.isVerified ?? false;
    const canTransact = isVerified && !isWalletFrozen;

    const allTransactions = useMemo(() => wallet?.transactions ?? [], [wallet]);
    const paginatedTransactions = useMemo(() =>
        allTransactions.slice((page - 1) * limit, page * limit),
        [allTransactions, page, limit]
    );

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] font-sans selection:bg-[#00C853]/20 pb-12">
            <div className="max-w-[900px] mx-auto px-6 py-8 space-y-5">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[16px] font-semibold text-[#e8eaed] tracking-tight m-0 uppercase">Account Funds</h1>
                        <p className="text-[11px] text-[#5a5f6e] mt-0.5 m-0 uppercase tracking-wider">Wallet & Transaction Audit</p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className={`p-2 bg-[#111214] border border-[#1e2025] rounded-md text-[#5a5f6e] hover:text-[#e8eaed] hover:border-[#2a2d35] transition-all ${isFetching ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>

                <div className="space-y-2">
                    {!isVerified && <KycWarningBox />}
                    {isWalletFrozen && <WalletFrozenAlert />}
                </div>

                <WalletBalanceBar 
                    balance={balance} 
                    canTransact={canTransact} 
                />

                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 px-1">
                        <History size={13} className="text-[#5a5f6e]" />
                        <h2 className="text-[11px] font-bold text-[#5a5f6e] uppercase tracking-wider">Transaction Ledger</h2>
                    </div>

                    <div className="bg-[#111214] border border-[#1e2025] rounded-lg overflow-hidden shadow-sm">
                        <TransactionHistoryTable 
                            transactions={paginatedTransactions as WalletTransaction[]} 
                        />
                        
                        <Pagination
                            page={page}
                            limit={limit}
                            total={allTransactions.length}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
