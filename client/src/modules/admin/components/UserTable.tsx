'use client';

import { DataTable } from '@shared/components/table/DataTableComponent';
import type { User } from '@shared/components/interfaces/IUserTable';

interface Props {
    users: User[];
    isLoading?: boolean;
    onBlockToggle?: (user: User) => void;
}

export function UserTable({
    users,
    isLoading,
    onBlockToggle,
}: Props) {
    return (
        <DataTable<User>
            data={users}
            isLoading={isLoading}
            onBlock={onBlockToggle} 
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
                    className: 'max-w-[240px] truncate text-neutral-400',
                },
                {
                    key: 'isVerified',
                    label: 'Verified',
                    render: (u) => (
                        <span
                            className={`rounded border px-2 py-0.5 text-[10px] ${u.isVerified
                                    ? 'border-emerald-500/30 text-emerald-400'
                                    : 'border-neutral-500/30 text-neutral-400'
                                }`}
                        >
                            {u.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                    ),
                },
                {
                    key: 'isBlocked',
                    label: 'Status',
                    render: (u) => (
                        <span
                            className={`rounded border px-2 py-0.5 text-[10px] ${u.isBlocked
                                    ? 'border-red-500/30 text-red-400'
                                    : 'border-emerald-500/30 text-emerald-400'
                                }`}
                        >
                            {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                    ),
                },
                {
                    key: 'createdAt',
                    label: 'Joined',
                    render: (u) =>
                        u.createdAt ? (
                            <span className="text-neutral-400 text-[11px]">
                                {new Date(u.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        ) : (
                            '—'
                        ),
                },
            ]}
        />
    );
}
