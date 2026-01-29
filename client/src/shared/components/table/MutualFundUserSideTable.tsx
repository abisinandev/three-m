'use client';

import { DataTable } from '@shared/components/table/DataTableComponent';
import type { MutualFundType, FundStatus } from '@shared/types/mutual-funds/MutualFundType';

interface Props {
    funds: MutualFundType[];
    isLoading?: boolean;
    onDelete?: (fund: MutualFundType) => void;
    onEdit?: (fund: MutualFundType) => void;
    onStatusToggle?: (fund: MutualFundType, status: FundStatus) => void;
}

export function MutualFundsTable({
    funds,
    isLoading,
    onDelete,
    onEdit,
}: Props) {
    return (
        <DataTable
            data={funds}
            isLoading={isLoading}
            onDelete={onDelete}
            onEdit={onEdit}
   
            columns={[
                {
                    key: 'schemeCode',
                    label: 'Code',
                    className: 'font-mono text-neutral-400',
                },

                {
                    key: 'schemeName',
                    label: 'Fund',
                    render: (f: MutualFundType) => (
                        <div className="flex items-center gap-2 max-w-[260px]">
                            <img
                                src={f.logo}
                                alt={f.schemeName}
                                className="w-6 h-6 rounded object-contain bg-white"
                            />
                            <span className="truncate">{f.schemeName}</span>
                        </div>
                    ),
                },

                {
                    key: 'amc',
                    label: 'AMC',
                },

                {
                    key: 'subCategory',
                    label: 'Category',
                },

                {
                    key: 'risk',
                    label: 'Risk',
                    render: (f: MutualFundType) => (
                        <span
                            className={`px-2 py-0.5 rounded text-[10px] border ${f.risk === 'High'
                                    ? 'text-red-400 border-red-500/30'
                                    : f.risk === 'Medium'
                                        ? 'text-orange-400 border-orange-500/30'
                                        : 'text-emerald-400 border-emerald-500/30'
                                }`}
                        >
                            {f.risk}
                        </span>
                    ),
                },

                {
                    key: 'nav',
                    label: 'NAV',
                    render: (f: MutualFundType) => (
                        <div className="flex flex-col text-[11px]">
                            <span className="font-medium text-neutral-200">
                                ₹ {f.nav.toFixed(2)}
                            </span>
                            <span className="text-neutral-500">
                                {new Date(f.navDate).toLocaleDateString()}
                            </span>
                        </div>
                    ),
                },

                {
                    key: 'status',
                    label: 'Status',
                    render: (f: MutualFundType) => (
                        <span
                            className={`px-2 py-0.5 rounded text-[10px] ${f.status === 'Active'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-orange-500/10 text-orange-400'
                                }`}
                        >
                            {f.status}
                        </span>
                    ),
                },
            ]}
        />
    );
}
