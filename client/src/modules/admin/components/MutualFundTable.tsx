'use client';

import { DataTable } from '@shared/components/table/MutualFundTable';
import type { MutualFundType } from '@shared/types/mutual-funds/MutualFundType';

interface Props {
    funds: MutualFundType[];
    isLoading?: boolean;
    onDelete?: (fund: MutualFundType) => void;
    onEdit?: (fund: MutualFundType) => void;
    onStatusToggle?: (fund: MutualFundType, status: 'ACTIVE' | 'INACTIVE') => void;
}

export function MutualFundsTable({
    funds,
    isLoading,
    onDelete,
    onEdit,
    onStatusToggle,
}: Props) {
    return (
        <DataTable
            data={funds}
            isLoading={isLoading}
            onDelete={onDelete}
            onEdit={onEdit}
            onStatusChange={onStatusToggle}
            columns={[
                {
                    key: 'schemeCode',
                    label: 'Code',
                    className: 'font-mono text-neutral-400',
                },
                {
                    key: 'schemeName',
                    label: 'Fund Name',
                    className: 'max-w-[260px] truncate',
                },
                { key: 'amc', label: 'AMC' },
                { key: 'subCategory', label: 'Category' },
                {
                    key: 'risk',
                    label: 'Risk',
                    render: f => (
                        <span
                            className={`rounded border px-2 py-0.5 text-[10px] ${f.risk === 'High'
                                    ? 'border-red-500/30 text-red-400'
                                    : f.risk === 'Medium'
                                        ? 'border-orange-500/30 text-orange-400'
                                        : 'border-emerald-500/30 text-emerald-400'
                                }`}
                        >
                            {f.risk}
                        </span>
                    ),
                },
                {
                    key: 'latestNav',
                    label: 'NAV',
                    render: f => {
                        if (!f.nav) {
                            return <span className="text-neutral-500">—</span>;
                        }

                        return (
                            <div className="flex flex-col text-[11px]">
                                <span className="font-medium text-neutral-200">
                                    ₹ {f.nav.toFixed(2)}
                                </span>
                                <span className="text-neutral-500">
                                    {new Date(f.navDate).toLocaleDateString()}
                                </span>
                            </div>
                        );
                    },
                },
            ]}
        />
    );
}
