'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useDebounce } from 'use-debounce';
import { Plus, Download, Search, ChevronDown, CheckCheck, Clock, Ban, Layers } from 'lucide-react';
import type {
    MutualFundType,
    PaginatedMutualFundsResponse,
} from '@shared/types/mutual-funds/MutualFundType';
import { Pagination } from '@shared/components/pagination/Pagination';
import { MutualFundsTable } from '../components/MutualFundTable';
import { fetchMutualFunds, updateStatus } from '@shared/services/admin/mutual-fund-management/mutual-fund-admin-side';
import { StatsCardComponent } from '@shared/components/cards/StatCardComponent';
import { ROUTES } from '@shared/constants/routes';


export default function MutualFundsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const ITEMS_PER_PAGE = 10;

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name-asc');
    const [sortOpen, setSortOpen] = useState(false);

    const sortRef = useRef<HTMLDivElement>(null);
    const [debouncedSearch] = useDebounce(searchTerm, 400);

    const { data, isLoading } = useQuery<PaginatedMutualFundsResponse>({
        queryKey: ['mutual-funds', page, debouncedSearch, sortBy],
        queryFn: () =>
            fetchMutualFunds({
                page,
                search: debouncedSearch,
                sort: sortBy,
            }),
        placeholderData: p => p,
    });

    const {
        funds,
        total,
        totalActive,
        totalInactive,
        todayUpdated,
    } = useMemo(() => {
        const list = data?.data ?? [];
        const today = new Date();

        return {
            funds: list,
            total: data?.total ?? 0,
            totalActive: data?.totalActiveFunds ?? 0,
            totalInactive: data?.totalInactiveFunds ?? 0,
            todayUpdated: list.filter((f) => {
                const updated = new Date(f.updatedAt);
                return (
                    updated.getDate() === today.getDate() &&
                    updated.getMonth() === today.getMonth() &&
                    updated.getFullYear() === today.getFullYear()
                );
            }).length,
        };
    }, [data]);

    const handleStatusToggle = async (fund: MutualFundType, newStatus: 'Active' | 'Inactive') => {
        if (!confirm(`Change status to ${newStatus}?`)) return;
        try {
            await updateStatus(fund, newStatus);
            queryClient.invalidateQueries({ queryKey: ['mutual-funds'] });
        } catch {
            alert('Failed to update status');
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setSortOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sortOptions = [
        { value: 'name-asc', label: 'Name (A–Z)' },
        { value: 'name-desc', label: 'Name (Z–A)' },
        { value: 'amc-asc', label: 'AMC (A–Z)' },
        { value: 'updated-desc', label: 'Recently Updated' },
        { value: 'risk', label: 'Risk Level' },
    ];


    return (
        <div className="p-6 space-y-5">

            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-white">Mutual Funds</h1>

                <div className="flex items-center gap-2">
                    <button
                        aria-label="Export funds"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs bg-neutral-800 hover:bg-neutral-700 rounded-md transition"
                    >
                        <Download size={14} />
                        Export
                    </button>

                    <button
                        onClick={() => navigate({ to: ROUTES.ADMIN.MUTUAL_FUNDS_MANAGEMENT.ADD_NEW })}
                        aria-label="Add new fund"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 rounded-md font-medium transition"
                    >
                        <Plus size={14} />
                        Add Fund
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCardComponent
                    title="Total Funds"
                    value={total.toLocaleString()}
                    icon={<Layers className="w-5 h-5 text-blue-400" />}
                    color="text-blue-400"
                    subtitle="All listed mutual funds"
                />

                <StatsCardComponent
                    title="Active Funds"
                    value={totalActive.toLocaleString()}
                    icon={<CheckCheck className="w-5 h-5 text-emerald-400" />}
                    color="text-emerald-400"
                    subtitle={
                        total > 0
                            ? `${((totalActive / total) * 100).toFixed(1)}% active`
                            : "No active funds"
                    }
                />

                <StatsCardComponent
                    title="Inactive Funds"
                    value={totalInactive.toLocaleString()}
                    icon={<Ban className="w-5 h-5 text-orange-400" />}
                    color="text-orange-400"
                    subtitle={
                        total > 0
                            ? `${((totalInactive / total) * 100).toFixed(1)}% inactive`
                            : "No inactive funds"
                    }
                />

                <StatsCardComponent
                    title="Updated Today"
                    value={todayUpdated.toLocaleString()}
                    icon={<Clock className="w-5 h-5 text-cyan-400" />}
                    color="text-cyan-400"
                    subtitle="Funds updated today"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative w-full sm:w-80">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    />
                    <input
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search funds..."
                        className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs placeholder-neutral-500 focus:border-emerald-500/50 focus:outline-none transition"
                    />
                </div>

                <div ref={sortRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setSortOpen((v) => !v)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-md hover:bg-neutral-800 transition"
                    >
                        Sort
                        <ChevronDown
                            size={14}
                            className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {sortOpen && (
                        <div
                            role="menu"
                            className="absolute right-0 mt-1 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10"
                        >
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        setSortBy(option.value);
                                        setSortOpen(false);
                                        setPage(1);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-700 transition ${sortBy === option.value
                                        ? 'bg-neutral-700 text-emerald-400'
                                        : 'text-neutral-300'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-md overflow-hidden">
                <MutualFundsTable
                    funds={funds}
                    isLoading={isLoading}
                    onStatusToggle={handleStatusToggle}
                />

                <Pagination
                    page={page}
                    limit={ITEMS_PER_PAGE}
                    total={total}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}

