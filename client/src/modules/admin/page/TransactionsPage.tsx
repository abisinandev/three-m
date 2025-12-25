import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    BadgeCheck,
    Clock,
    CheckCircle,
    XCircle,
    ShieldCheck,
    Eye,
    ChevronUp,
    ExternalLink,
    RefreshCw,
    DollarSign,
    ArrowUpDown,
    AlertCircle,
    RotateCw,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import React, { useState } from "react";
import { TransactionsApi } from "@shared/services/admin/TransactionsApi";
import ConfirmModal from "@shared/components/modals/ConfirmModal";
import adminApi from "@lib/axiosAdmin";
import { toast } from "sonner";
import { format } from "date-fns";

interface Transaction {
    id: string;
    userId: string;
    userCode: string;
    amount: number;
    currency: string;
    createdAt: string;
    paymentStatus: string;
    isVerified: boolean;
    referenceType?: string;
    transactionId: string;
    type: string;
}

interface TransactionsResponse {
    success: boolean;
    message: string;
    data: {
        data: Transaction[];
        total: number;
        totalPages: number;
        limit: number;
        page: number;
        successfulTransactions: number;
        failedTransactions: number;
        pendingTransactions: number;
        totalAmount: number;
    };
}

const PaymentStatusBadge = ({ status }: { status: string }) => {
    if (status === "SUCCESSFUL")
        return (
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <CheckCircle size={12} /> Success
            </div>
        );
    if (status === "FAILED")
        return (
            <div className="flex items-center gap-1 text-[11px] text-red-400">
                <XCircle size={12} /> Failed
            </div>
        );
    return (
        <div className="flex items-center gap-1 text-[11px] text-amber-400">
            <Clock size={12} /> Pending
        </div>
    );
};

const LedgerStatusBadge = ({ verified }: { verified: boolean }) => {
    return verified ? (
        <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <ShieldCheck size={12} /> Verified
        </div>
    ) : (
        <div className="flex items-center gap-1 text-[11px] text-amber-400">
            <Clock size={12} /> Pending
        </div>
    );
};

const Pagination = ({ page, limit, total, onPageChange }: { page: number; limit: number; total: number; onPageChange: (page: number) => void }) => {
    const totalPages = Math.ceil(total / limit);
    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const showPages = 5;

    let start = Math.max(1, page - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    if (end === totalPages) {
        start = Math.max(1, totalPages - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-between border-t border-neutral-800 px-6 py-4">
            <p className="text-xs text-neutral-500">
                Showing {startItem}–{endItem} of {total.toLocaleString()} results
            </p>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className={`p-2 rounded-lg transition ${page === 1
                        ? "text-neutral-600 cursor-not-allowed"
                        : "text-neutral-400 hover:bg-neutral-700"
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`min-w-10 px-3 py-2 rounded-lg text-xs font-medium transition ${page === p
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "text-neutral-400 hover:bg-neutral-700"
                            }`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`p-2 rounded-lg transition ${page === totalPages
                        ? "text-neutral-600 cursor-not-allowed"
                        : "text-neutral-400 hover:bg-neutral-700"
                        }`}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default function TransactionManagementPage() {
    const queryClient = useQueryClient();
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
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

    const [verifyModal, setVerifyModal] = useState<{
        open: boolean;
        txId: string | null;
        userCode: string;
    }>({ open: false, txId: null, userCode: "" });

    const verifyMutation = useMutation({
        mutationFn: (txId: string) => adminApi.patch(`/transaction-verify/${txId}`),
        onSuccess: (res) => {
            toast.success(res.data.message || "Transaction verifieds");
            queryClient.invalidateQueries({ queryKey: ["admin-transactions-ledger"] });
            setVerifyModal({ open: false, txId: null, userCode: "" });
        },
        onError: (err: any) => {
            toast.error(err?.respnose?.data?.message || "Verification failed")
            setVerifyModal({ open: false, txId: null, userCode: "" });

        }
    });

    const handleVerify = () => {
        if (verifyModal.txId) verifyMutation.mutate(verifyModal.txId);
    };

    const toggleExpand = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setExpandedRow(null);
    };

    const handleResetFilter = () => {
        setStatusFilter("ALL");
        setCurrentPage(1);
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <BadgeCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-white">
                            Transaction Ledger Verification
                        </h1>
                        <p className="text-xs text-neutral-500">
                            Verify transactions before wallet settlement
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <RotateCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-neutral-500">Total Transactions</p>
                            <p className="text-lg font-semibold text-white mt-1">{meta.total}</p>
                        </div>
                        <ArrowUpDown className="w-5 h-5 text-neutral-500" />
                    </div>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-neutral-500">Successful</p>
                            <p className="text-lg font-semibold text-emerald-400 mt-1">
                                {meta.successfulTransactions}
                            </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-neutral-500">Failed</p>
                            <p className="text-lg font-semibold text-red-400 mt-1">
                                {meta.failedTransactions}
                            </p>
                        </div>
                        <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-neutral-500">Pending</p>
                            <p className="text-lg font-semibold text-amber-400 mt-1">
                                {meta.pendingTransactions}
                            </p>
                        </div>
                        <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-neutral-500">Total Amount</p>
                            <p className="text-lg font-semibold text-white mt-1">
                                ₹{meta.totalAmount.toLocaleString()}
                            </p>
                        </div>
                        <DollarSign className="w-5 h-5 text-neutral-500" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value as any);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 bg-neutral-900/60 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    >
                        <option value="ALL">All Status</option>
                        <option value="SUCCESSFUL">Successful</option>
                        <option value="FAILED">Failed</option>
                        <option value="PENDING">Pending</option>
                    </select>

                    {statusFilter !== "ALL" && (
                        <button
                            onClick={handleResetFilter}
                            className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition"
                        >
                            Clear filter
                        </button>
                    )}
                </div>
            </div>

            <div className="border border-neutral-800 rounded-lg bg-neutral-900/40 overflow-hidden">
                <table className="w-full text-[12px]">
                    <thead className="bg-neutral-900/60 border-b border-neutral-800">
                        <tr className="text-neutral-400 uppercase text-[11px]">
                            <th className="px-4 py-2 text-left">TxId</th>
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Purpose</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Payment</th>
                            <th className="px-4 py-2 text-left">Ledger</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {isLoading && (
                            <tr>
                                <td colSpan={8} className="py-8 text-center text-neutral-500">
                                    Loading transactions…
                                </td>
                            </tr>
                        )}
                        {isError && (
                            <tr>
                                <td colSpan={8} className="py-8 text-center text-red-400">
                                    Failed to load transactions
                                </td>
                            </tr>
                        )}
                        {!isLoading && !isError && transactions.length === 0 && (
                            <tr>
                                <td colSpan={8} className="py-8 text-center text-neutral-500">
                                    No transactions found
                                </td>
                            </tr>
                        )}
                        {!isLoading &&
                            !isError &&
                            transactions.map((tx) => {
                                const canVerify = tx.paymentStatus === "SUCCESSFUL" && !tx.isVerified;
                                const isExpanded = expandedRow === tx.id;

                                return (
                                    <React.Fragment key={tx.id}>
                                        <tr className="hover:bg-neutral-800/30">
                                            <td className="px-4 py-2 font-mono text-emerald-400">
                                                {tx.transactionId}
                                            </td>
                                            <td className="px-4 py-2">{tx.userCode}</td>
                                            <td className="px-4 py-2 capitalize">{tx.type}</td>
                                            <td className="px-4 py-2 capitalize">
                                                {tx.referenceType ?? "-"}
                                            </td>
                                            <td className="px-4 py-2 font-medium">
                                                ₹{tx.amount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2">
                                                <PaymentStatusBadge status={tx.paymentStatus} />
                                            </td>
                                            <td className="px-4 py-2">
                                                <LedgerStatusBadge verified={tx.isVerified} />
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => toggleExpand(tx.id)}
                                                    className="flex items-center gap-2 px-3 py-1.5 text-[11px] rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <ChevronUp size={14} />
                                                            Close
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye size={14} />
                                                            View
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>

                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={8} className="px-0 py-0">
                                                    <div className="bg-neutral-800/50 border-t border-neutral-700">
                                                        <div className="px-6 py-5 space-y-6">
                                                            <div>
                                                                <h4 className="text-xs font-medium text-neutral-400 uppercase mb-3">
                                                                    Transaction Information
                                                                </h4>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
                                                                    <div>
                                                                        <p className="text-neutral-500">Full Tx ID</p>
                                                                        <p className="font-mono text-emerald-400 break-all mt-1">
                                                                            {tx.transactionId}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-neutral-500">User</p>
                                                                        <p className="mt-1">{tx.userCode}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-neutral-500">Type</p>
                                                                        <p className="capitalize mt-1">{tx.type}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-neutral-500">Purpose</p>
                                                                        <p className="capitalize mt-1">{tx.referenceType ?? "-"}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-neutral-500">Amount</p>
                                                                        <p className="font-medium mt-1">₹{tx.amount.toLocaleString()}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-neutral-500">Currency</p>
                                                                        <p className="uppercase mt-1">{tx.currency}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-neutral-500">Created At</p>
                                                                        <p className="mt-1">
                                                                            {format(new Date(tx.createdAt), "dd MMM yyyy, HH:mm")}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-xs font-medium text-neutral-400 uppercase mb-3">
                                                                    Status Overview
                                                                </h4>
                                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[11px]">
                                                                    <div>
                                                                        <p className="text-neutral-500">Payment Status</p>
                                                                        <div className="mt-1">
                                                                            <PaymentStatusBadge status={tx.paymentStatus} />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-neutral-500">Ledger Verification</p>
                                                                        <div className="mt-1">
                                                                            <LedgerStatusBadge verified={tx.isVerified} />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-neutral-500">Block Verification</p>
                                                                        <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400">
                                                                            <AlertCircle size={12} /> Not implemented
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-neutral-700">
                                                                <h4 className="text-xs font-medium text-neutral-400 uppercase">
                                                                    Admin Actions
                                                                </h4>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    {canVerify && (
                                                                        <button
                                                                            onClick={() =>
                                                                                setVerifyModal({
                                                                                    open: true,
                                                                                    txId: tx.id,
                                                                                    userCode: tx.userId,
                                                                                })
                                                                            }
                                                                            className="px-3 py-1.5 text-[11px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 flex items-center gap-1.5"
                                                                        >
                                                                            <RefreshCw size={12} />
                                                                            Verify Ledger
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() =>
                                                                            window.open(
                                                                                `https://etherscan.io/tx/${tx.transactionId}`,
                                                                                "_blank"
                                                                            )
                                                                        }
                                                                        className="px-3 py-1.5 text-[11px] rounded bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 flex items-center gap-1.5"
                                                                    >
                                                                        <ExternalLink size={12} />
                                                                        View on Explorer
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                    </tbody>
                </table>

                <Pagination
                    page={currentPage}
                    limit={limit}
                    total={meta.total}
                    onPageChange={handlePageChange}
                />
            </div>

            <ConfirmModal
                isOpen={verifyModal.open}
                onClose={() => setVerifyModal({ open: false, txId: null, userCode: "" })}
                onConfirm={handleVerify}
                title="Verify Transaction"
                message={
                    <>
                        Are you sure you want to verify transaction for{" "}
                        <strong>{verifyModal.userCode}</strong>?
                        <p className="text-xs text-neutral-400 mt-1">
                            This will credit the wallet and lock the ledger entry.
                        </p>
                    </>
                }
                confirmText="Verify"
                loading={verifyMutation.isPending}
            />
        </div>
    );
}