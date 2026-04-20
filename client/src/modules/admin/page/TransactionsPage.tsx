import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RefreshCw, Layers } from "lucide-react";
import { useState } from "react";
import { TransactionsApi } from "@shared/services/admin/TransactionsApi";
import { TransactionStatsCard } from "../components/transactions/TransactionStatsCard";
import { TransactionsTable } from "../components/transactions/TransactionsTable";
import type { TransactionsResponse } from "../types/transaction.types";

export default function TransactionManagementPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [statusFilter, setStatusFilter] = useState<"ALL" | "SUCCESSFUL" | "FAILED" | "PENDING">("ALL");

    const queryKey = ["admin-transactions-ledger", currentPage, statusFilter];

    const { data, isLoading, isError, refetch, isFetching } = useQuery<TransactionsResponse>({
        queryKey,
        queryFn: () =>
            TransactionsApi({
                page: currentPage,
                limit,
                status: statusFilter === "ALL" ? undefined : statusFilter,
            }),
        placeholderData: keepPreviousData,
    });

    const apiData = data?.data;
    const transactions = apiData?.data ?? [];

    const meta = {
        total: apiData?.total ?? 0,
        totalPages: apiData?.totalPages ?? 1,
        successfulTransactions: apiData?.successfulTransactions ?? 0,
        failedTransactions: apiData?.failedTransactions ?? 0,
        pendingTransactions: apiData?.pendingTransactions ?? 0,
        totalAmount: apiData?.totalAmount ?? 0,
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="bg-[#0a0a0a] min-h-screen font-sans text-white p-5 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-bold mb-0.5">Transaction Ledger</h1>
                    <p className="text-neutral-400 text-[12px]">
                        Audit financial records across all platform modules.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded-md border border-neutral-700 text-[12px] font-medium transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={12} className={isFetching ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <TransactionStatsCard
                total={meta.total}
                successfulTransactions={meta.successfulTransactions}
                failedTransactions={meta.failedTransactions}
                pendingTransactions={meta.pendingTransactions}
                totalAmount={meta.totalAmount}
            />

            {/* Table  */}
            <div className="bg-[#121214] rounded-lg border border-neutral-800/80 overflow-hidden shadow-xl">

                <div className="p-3 border-b border-neutral-800/80 flex justify-between items-center bg-[#121214]">
                    <div className="flex items-center gap-1.5">
                        <Layers size={13} className="text-emerald-500" />
                        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">Audit Log</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as any);
                                setCurrentPage(1);
                            }}
                            className="px-2.5 py-1 bg-neutral-800/60 border border-neutral-700/80 rounded text-[12px] text-white focus:outline-none focus:border-emerald-500/50 w-[150px] transition-all font-medium"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="SUCCESSFUL">Successful</option>
                            <option value="FAILED">Failed</option>
                            <option value="PENDING">Pending</option>
                        </select>
                    </div>
                </div>

                <TransactionsTable
                    transactions={transactions}
                    isLoading={isLoading}
                    isError={isError}
                    currentPage={currentPage}
                    limit={limit}
                    total={meta.total}
                    totalPages={meta.totalPages}
                    totalAmount={meta.totalAmount}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}