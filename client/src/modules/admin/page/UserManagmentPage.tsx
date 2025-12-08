import { Users, Lock } from "lucide-react";
import { useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableComponent } from "@shared/components/table/UserTable";
import { Pagination } from "@shared/components/pagination/Pagination";
import { FiltersRow } from "@shared/components/filter/FilterComponent";
import { StatsCard } from "@shared/components/cards/UserManagementStatCards";
import { StatusBadge } from "@shared/components/buttons/StatusStyle";
import { FetchUserDetail, type UserFilters } from "@shared/services/admin/user-management/FetchUserDataApi";
import { BlockUserDataApi } from "@shared/services/admin/user-management/BlockUserDataApi";
import { UnblockUserApi } from "@shared/services/admin/user-management/UnblockUserApi";
import type { Column } from "@shared/components/interfaces/ITableColumn";
import type { Action } from "@shared/components/interfaces/ITableActions";
import type { User } from "@shared/components/interfaces/IUserTable";
import { useDebouncedCallback } from "use-debounce";
import ConfirmModal from "@shared/components/modals/ConfirmModal";

const columns: Column<User>[] = [
    { header: "User ID", accessor: "userCode" },
    { header: "Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    {
        header: "Status",
        accessor: "isBlocked",
        render: (user) => <StatusBadge status={user.isBlocked ? "Blocked" : "Active"} />,
    },
    {
        header: "Verified",
        accessor: "isVerified",
        render: (user) => (user.isVerified ? "Verified" : "Not verified"),
    },
    { header: "Joined", accessor: "createdAt" },
];

export default function UserManagement() {
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        limit: 10,
        search: "",
        role: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const [blockModal, setBlockModal] = useState<{ open: boolean; userCode: string | null; isBlock: boolean }>({
        open: false,
        userCode: null,
        isBlock: true,
    });

    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-users", filters],
        queryFn: () => FetchUserDetail(filters),
        placeholderData: keepPreviousData,
    });

    const users = data?.data.data ?? [];
    const total = data?.data.total ?? 0;

    const stats = {
        total,
        active: data?.data.totalActiveUsersCount ?? 0,
        blocked: data?.data.totalInActiveUsersCount ?? 0,
        verified: data?.data.totalVerifiedUsersCount ?? 0,
    };

    const debouncedSearch = useDebouncedCallback((search: string) => {
        updateFilters({ search, page: 1 });
    }, 400);

    const updateFilters = (updates: Partial<UserFilters>) =>
        setFilters((prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }));

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    };

    const handleBlockUnblock = async () => {
        if (!blockModal.userCode) return;

        try {
            if (blockModal.isBlock) {
                await BlockUserDataApi(blockModal.userCode);
            } else {
                await UnblockUserApi(blockModal.userCode);
            }
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        } finally {
            setBlockModal({ open: false, userCode: null, isBlock: true });
        }
    };

    const actions: Action<User>[] = [
        {
            label: "Block",
            className:
                "px-3 py-1 text-xs font-medium border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition",
            onClick: (user) =>
                setBlockModal({ open: true, userCode: user.userCode, isBlock: true }),
        },
        {
            label: "Unblock",
            className:
                "px-3 py-1 text-xs font-medium border border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded transition",
            onClick: (user) =>
                setBlockModal({ open: true, userCode: user.userCode, isBlock: false }),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage user accounts and permissions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-4">
                <StatsCard
                    title="Total Users"
                    value={stats.total.toString()}
                    icon={<Users className="w-5 h-5 text-blue-400" />}
                    color="text-blue-400"
                    subtitle="All registered users"
                />
                <StatsCard
                    title="Active Users"
                    value={stats.active.toString()}
                    icon={<Users className="w-5 h-5 text-emerald-400" />}
                    color="text-emerald-400"
                    subtitle={
                        stats.total > 0 ? `${((stats.active / stats.total) * 100).toFixed(1)}% active` : "0% active"
                    }
                />
                <StatsCard
                    title="Blocked Users"
                    value={stats.blocked.toString()}
                    icon={<Lock className="w-5 h-5 text-red-400" />}
                    color="text-red-400"
                    subtitle={
                        stats.total > 0 ? `${((stats.blocked / stats.total) * 100).toFixed(1)}% blocked` : "0% blocked"
                    }
                />
                <StatsCard
                    title="Verified Users"
                    value={stats.verified.toString()}
                    icon={
                        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    }
                    color="text-cyan-400"
                    subtitle={
                        stats.total > 0
                            ? `${((stats.verified / stats.total) * 100).toFixed(1)}% verified`
                            : "0% verified"
                    }
                />
            </div>

            {/* Filters */}
            <FiltersRow
                onSearch={debouncedSearch}
                onFilterChange={(key, value) => updateFilters({ [key]: value, page: 1 })}
                currentFilters={filters}
                onRefresh={handleRefresh}
            />

            {/* Table + Pagination */}
            <div className="bg-[#111111] border border-neutral-800 rounded-lg overflow-hidden">
                {isLoading ? (
                    <div className="py-12 text-center text-gray-400">Loading users...</div>
                ) : isError ? (
                    <div className="py-12 text-center text-red-400">Failed to load users</div>
                ) : (
                    <>
                        <TableComponent columns={columns} data={users} actions={actions} />

                        <Pagination
                            page={filters.page as number}
                            limit={filters.limit as number}
                            total={total}
                            onPageChange={(page) => updateFilters({ page })}
                        />
                    </>
                )}
            </div>

            {/* Block / Unblock Confirm Modal */}
            <ConfirmModal
                isOpen={blockModal.open}
                onClose={() => setBlockModal({ open: false, userCode: null, isBlock: true })}
                onConfirm={handleBlockUnblock}
                title={blockModal.isBlock ? "Block User" : "Unblock User"}
                message={
                    blockModal.isBlock
                        ? "This user will no longer be able to log in or use the platform."
                        : "This user will regain access to the platform."
                }
                confirmText={blockModal.isBlock ? "Block User" : "Unblock User"}
                cancelText="Cancel"
                variant={blockModal.isBlock ? "destructive" : "success"}
            />
        </div>
    );
}