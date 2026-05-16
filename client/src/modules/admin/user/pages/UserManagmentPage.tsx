'use client';

import { Users, Lock } from 'lucide-react';
import { useState, useMemo } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { Pagination } from '@shared/components/pagination/Pagination';
import { FiltersRow } from '@shared/components/filter/FilterComponent';
import ConfirmModal from '@shared/components/modals/ConfirmModal';
import {
    FetchUserDetail,
} from '@shared/services/admin/user-management/fetch-user-data-api';
import { BlockUserDataApi } from '@shared/services/admin/user-management/block-user-data-api';
import { UnblockUserApi } from '@shared/services/admin/user-management/unblock-user-api';
import { StatsCardComponent } from '@shared/components/cards/StatCardComponent';
import { UserTable } from '../components/UserTable';
import type { User } from '@shared/components/interfaces/IUserTable';
import type { UserFilters } from '@/shared/types/admin/user-management.types';


const calculateUserStats = (data: { total?: number; totalActiveUsersCount?: number; totalInActiveUsersCount?: number; totalVerifiedUsersCount?: number } | undefined) => ({
    total: data?.total ?? 0,
    active: data?.totalActiveUsersCount ?? 0,
    blocked: data?.totalInActiveUsersCount ?? 0,
    verified: data?.totalVerifiedUsersCount ?? 0,
});

export default function UserManagement() {
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        limit: 10,
        search: '',
        role: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const [blockModal, setBlockModal] = useState<{
        open: boolean;
        user: User | null;
    }>({
        open: false,
        user: null,
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin-users', filters],
        queryFn: () => FetchUserDetail(filters),
        placeholderData: keepPreviousData,
    });

    const users = useMemo(() => data?.data.data ?? [], [data]);
    const total = data?.data.total ?? 0;
    const stats = useMemo(() => calculateUserStats(data?.data), [data]);

    const updateFilters = (updates: Partial<UserFilters>) => {
        setFilters((prev) => ({
            ...prev,
            ...updates,
            page: updates.page ?? 1,
        }));
    };

    const debouncedSearch = useDebouncedCallback(
        (search: string) => updateFilters({ search }),
        400
    );

    const handleBlockConfirm = async () => {
        if (!blockModal.user) return;

        try {
            if (blockModal.user.isBlocked) {
                await UnblockUserApi(blockModal.user.id);
            } else {
                await BlockUserDataApi(blockModal.user.id);
            }

            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        } finally {
            setBlockModal({ open: false, user: null });
        }
    };

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-xl font-semibold text-white">User Management</h1>
                <p className="text-xs text-neutral-400">
                    Manage user accounts and permissions
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCardComponent
                    title="Total Users"
                    value={stats.total}
                    icon={<Users />}
                    color="text-emerald-400"
                    subtitle={
                        total > 0
                            ? `${((total / total) * 100).toFixed(1)}% active`
                            : "No active funds"
                    }
                />
                <StatsCardComponent
                    title="Active Users"
                    value={stats.active}
                    icon={<Users />}
                    color="text-emerald-400"
                    subtitle={
                        total > 0
                            ? `${((stats.active / total) * 100).toFixed(1)}% active`
                            : "No active funds"
                    }
                />
                <StatsCardComponent
                    title="Blocked Users"
                    value={stats.blocked}
                    icon={<Lock />}
                    color="text-emerald-400"
                    subtitle={
                        total > 0
                            ? `${((stats.blocked / total) * 100).toFixed(1)}% active`
                            : "No active funds"
                    }
                />
                <StatsCardComponent
                    title="Verified Users"
                    value={stats.verified}
                    icon={<Users />}
                    color="text-emerald-400"
                    subtitle={
                        total > 0
                            ? `${((stats.verified / total) * 100).toFixed(1)}% active`
                            : "No active funds"
                    }
                />
            </div>

            <FiltersRow
                onSearch={debouncedSearch}
                onFilterChange={(key, value) =>
                    updateFilters({ [key]: value })
                }
                currentFilters={filters}
                onRefresh={() =>
                    queryClient.invalidateQueries({ queryKey: ['admin-users'] })
                }
            />

            <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">

                {isError && (
                    <div className="py-12 text-center text-xs text-red-400">
                        Failed to load users
                    </div>
                )}

                {!isError && (
                    <>
                        <UserTable
                            users={users}
                            isLoading={isLoading}
                            onBlockToggle={(user) =>
                                setBlockModal({ open: true, user })
                            }
                        />

                        {!isLoading && users.length > 0 && (
                            <Pagination
                                page={filters.page as number}
                                limit={filters.limit as number}
                                total={total}
                                onPageChange={(page) => updateFilters({ page })}
                            />
                        )}
                    </>
                )}
            </div>

            <ConfirmModal
                isOpen={blockModal.open}
                onClose={() => setBlockModal({ open: false, user: null })}
                onConfirm={handleBlockConfirm}
                title={blockModal.user?.isBlocked ? 'Unblock User' : 'Block User'}
                message={
                    blockModal.user?.isBlocked
                        ? 'This user will regain access.'
                        : 'This user will be blocked from the platform.'
                }
                confirmText={blockModal.user?.isBlocked ? 'Unblock' : 'Block'}
                cancelText="Cancel"
                variant={blockModal.user?.isBlocked ? 'success' : 'destructive'}
            />
        </div>
    );
}

