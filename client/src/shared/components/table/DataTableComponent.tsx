'use client';

import { ChevronDown, Edit2, LockKeyhole, LockKeyholeOpen, SquareArrowOutUpRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FundStatus } from '@shared/types/mutual-funds/MutualFundType';

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onStatusChange?: (row: T, status: FundStatus) => void;
    onView?: (row: T) => void;
    onBlock?: (row: T) => void;
}

export function DataTable<T>({
    data,
    columns,
    isLoading,
    onEdit,
    onDelete,
    onStatusChange,
    onBlock,
    onView,
}: DataTableProps<T>) {
    const [openRow, setOpenRow] = useState<string | null>(null);

    if (isLoading) {
        return <div className="p-6 text-xs text-neutral-500">Loading...</div>;
    }

    if (!data.length) {
        return <div className="p-6 text-xs text-neutral-500">No data found</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs">
                <thead className="bg-neutral-800/60 text-neutral-400">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className={`px-3 py-2 text-left ${col.className ?? ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                        <th className="px-3 py-2 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-neutral-800">
                    {data.map((row, index) => {
                        const rowWithCommonFields = row as T & { id?: string; schemeCode?: string; status?: string; isBlocked?: boolean };
                        const rowId =
                            rowWithCommonFields.id ??
                            rowWithCommonFields.schemeCode ??
                            index;

                        const status = rowWithCommonFields.status as FundStatus | undefined;

                        return (
                            <tr key={rowId} className="hover:bg-neutral-800/40">
                                {columns.map((col) => (
                                    <td
                                        key={String(col.key)}
                                        className={`px-3 py-2 ${col.className ?? ''}`}
                                    >
                                        {col.render
                                            ? col.render(row)
                                            : String((row as Record<string, unknown>)[col.key as string])}
                                    </td>
                                ))}

                                <td className="px-3 py-2">
                                    <div className="flex items-center justify-center gap-2 relative">
                                        {status && onStatusChange && (
                                            <button
                                                onClick={() =>
                                                    setOpenRow(openRow === rowId ? null : rowId)
                                                }
                                                className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-700/60 hover:bg-neutral-700 text-[10px]"
                                            >
                                                {status}
                                                <ChevronDown size={12} />
                                            </button>
                                        )}

                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="p-1 rounded hover:bg-neutral-700"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        )}

                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(row)}
                                                className="p-1 rounded hover:bg-red-500/20 text-red-400"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}

                                        {onBlock && (
                                            <button
                                                onClick={() => onBlock(row)}
                                                className={`p-1 rounded transition ${rowWithCommonFields.isBlocked
                                                    ? 'hover:bg-emerald-500/20 text-emerald-400'
                                                    : 'hover:bg-red-500/20 text-red-400'
                                                    }`}
                                                title={rowWithCommonFields.isBlocked ? 'Unblock user' : 'Block user'}
                                            >
                                                {rowWithCommonFields.isBlocked ? (
                                                    <LockKeyhole size={14} />
                                                ) : (
                                                    <LockKeyholeOpen size={14} />
                                                )}
                                            </button>
                                        )}

                                        {onView && (
                                            <button
                                                onClick={() => onView(row)}
                                                className={`p-1 rounded transition ${rowWithCommonFields.isBlocked
                                                    ? 'hover:bg-emerald-500/20 text-emerald-400'
                                                    : 'hover:bg-red-500/20 text-red-400'
                                                    }`}
                                                title={rowWithCommonFields.isBlocked ? 'Unblock user' : 'Block user'}
                                            >
                                                {<SquareArrowOutUpRight  size={14}/>}
                                            </button>
                                        )}

                                        {openRow === rowId && onStatusChange && (
                                            <div className="absolute top-7 right-0 bg-neutral-900 border border-neutral-800 rounded shadow z-10">
                                                {(['Active', 'Inactive'] as FundStatus[]).map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => {
                                                            onStatusChange(row, s);
                                                            setOpenRow(null);
                                                        }}
                                                        className="block w-full px-3 py-1.5 text-left hover:bg-neutral-800"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
