import { Users, Lock } from "lucide-react";
import { useState, useMemo } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { TableComponent } from "@shared/components/table/TableComponent";
import { Pagination } from "@shared/components/pagination/Pagination";
import { FiltersRow } from "@shared/components/filter/FilterComponent";
import { StatsCard } from "@shared/components/cards/UserManagementStatCards";
import ConfirmModal from "@shared/components/modals/ConfirmModal";
import {
    FetchUserDetail,
    type UserFilters,
} from "@shared/services/admin/user-management/FetchUserDataApi";
import type { Action } from "@shared/components/interfaces/ITableActions";
import type { User } from "@shared/components/interfaces/IUserTable";
import { BlockUserDataApi } from "@shared/services/admin/user-management/BlockUserDataApi";
import { UnblockUserApi } from "@shared/services/admin/user-management/UnblockUserApi";
import { columns } from "../utils/UserTableUtils";


const calculateUserStats = (data: any) => {
    const total = data?.total ?? 0;

    return {
        total,
        active: data?.totalActiveUsersCount ?? 0,
        blocked: data?.totalInActiveUsersCount ?? 0,
        verified: data?.totalVerifiedUsersCount ?? 0,
    };
};


export default function UserManagement() {
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        limit: 10,
        search: "",
        role: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const [blockModal, setBlockModal] = useState<{
        open: boolean;
        userId: string | null;
        isBlock: boolean;
    }>({
        open: false,
        userId: null,
        isBlock: true,
    });


    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-users", filters],
        queryFn: () => FetchUserDetail(filters),
        placeholderData: keepPreviousData,
    });

    const users = useMemo(() => data?.data.data ?? [], [data]);
    const total = data?.data.total ?? 0;

    const stats = useMemo(
        () => calculateUserStats(data?.data),
        [data]
    );

    const updateFilters = (updates: Partial<UserFilters>) => {
        setFilters((prev) => ({
            ...prev,
            ...updates,
            page: updates.page ?? 1,
        }));
    };

    const debouncedSearch = useDebouncedCallback((search: string) => {
        updateFilters({ search, page: 1 });
    }, 400);

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    };

    const handleBlockUnblock = async () => {
        if (!blockModal.userId) return;

        try {
            if (blockModal.isBlock) {
                await BlockUserDataApi(blockModal.userId);
            } else {
                await UnblockUserApi(blockModal.userId);
            }

            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        } finally {
            setBlockModal({ open: false, userId: null, isBlock: true });
        }
    };

    const actions: Action<User>[] = [
        {
            label: (user:User) => (user.isBlocked ? "Unblock" : "Block"),
            className: (user) =>
                user.isBlocked
                    ? "px-3 py-1 text-xs font-medium border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition"
                    : "px-3 py-1 text-xs font-medium border border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded transition",
            onClick: (user) =>
                setBlockModal({
                    open: true,
                    userId: user.id,
                    isBlock: !user.isBlocked,
                }),
        },
    ];


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage user accounts and permissions
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        stats.total
                            ? `${((stats.active / stats.total) * 100).toFixed(1)}% active`
                            : "0% active"
                    }
                />
                <StatsCard
                    title="Blocked Users"
                    value={stats.blocked.toString()}
                    icon={<Lock className="w-5 h-5 text-red-400" />}
                    color="text-red-400"
                    subtitle={
                        stats.total
                            ? `${((stats.blocked / stats.total) * 100).toFixed(1)}% blocked`
                            : "0% blocked"
                    }
                />
                <StatsCard
                    title="Verified Users"
                    value={stats.verified.toString()}
                    icon={<Users className="w-5 h-5 text-cyan-400" />}
                    color="text-cyan-400"
                    subtitle={
                        stats.total
                            ? `${((stats.verified / stats.total) * 100).toFixed(1)}% verified`
                            : "0% verified"
                    }
                />
            </div>

            <FiltersRow
                onSearch={debouncedSearch}
                onFilterChange={(key, value) =>
                    updateFilters({ [key]: value, page: 1 })
                }
                currentFilters={filters}
                onRefresh={handleRefresh}
            />

            <div className="bg-[#111111] border border-neutral-800 rounded-lg overflow-hidden">
                {isLoading ? (
                    <div className="py-12 text-center text-gray-400">
                        Loading users...
                    </div>
                ) : isError ? (
                    <div className="py-12 text-center text-red-400">
                        Failed to load users
                    </div>
                ) : (
                    <>
                        <TableComponent
                            columns={columns}
                            data={users}
                            actions={actions}
                        />

                        <Pagination
                            page={filters.page as number}
                            limit={filters.limit as number}
                            total={total}
                            onPageChange={(page) => updateFilters({ page })}
                        />
                    </>
                )}
            </div>

            <ConfirmModal
                isOpen={blockModal.open}
                onClose={() =>
                    setBlockModal({ open: false, userId: null, isBlock: true })
                }
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
