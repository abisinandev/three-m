'use client';

import { DataTable } from '@shared/components/table/DataTableComponent';
import type { KycUser } from '@shared/types/user/KycUserType';
import { StatusBadge } from './StatusBadges';

interface Props {
    users: KycUser[];
    isLoading?: boolean;
    onView?: (user: KycUser) => void;
}

export function KycUsersTable({
    users,
    isLoading,
    onView,
}: Props) {
    return (
        <DataTable<KycUser>
            data={users}
            isLoading={isLoading}
            onView={onView}   // reuse edit icon as view (same pattern as MF table)
            columns={[
                {
                    key: 'userCode',
                    label: 'User ID',
                    className: 'font-mono text-neutral-400',
                },
                {
                    key: 'fullName',
                    label: 'Name',
                    className: 'max-w-[200px] truncate',
                },
                {
                    key: 'email',
                    label: 'Email',
                    className: 'max-w-[220px] truncate text-neutral-400',
                },
                {
                    key: 'panNumber',
                    label: 'PAN',
                    className: 'font-mono tracking-wider',
                },
                {
                    key: 'status',
                    label: 'Status',
                    render: (user) => (
                        <StatusBadge status={user.status} />
                    ),
                },
                {
                    key: 'createdAt',
                    label: 'Submitted',
                    render: (user) =>
                        user.createdAt ? (
                            <div className="flex flex-col text-[11px]">
                                <span className="font-medium text-neutral-200">
                                    {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                                <span className="text-neutral-500">
                                    {new Date(user.createdAt).toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        ) : (
                            <span className="text-neutral-500">—</span>
                        ),
                },
            ]}
        />
    );
}
