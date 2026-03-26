import { useState, useMemo } from 'react';
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { Pagination } from '@shared/components/pagination/Pagination';
import { FetchStockDataApi } from '@shared/services/admin/stock-management/FetchStockDataApi';
import type { StockFilters } from '@shared/services/admin/stock-management/FetchStockDataApi';
import { UpdateStockStatusApi } from '@shared/services/admin/stock-management/UpdateStockStatusApi';
import { StockTable } from '../components/StockTable';
import type { Stock } from '@shared/components/interfaces/IStockTable';

export default function StockManagementPage() {
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState<StockFilters>({
        page: 1,
        limit: 20,
        search: '',
        exchange: '',
        isTradable: '',
        isTracked: '',
        isVisible: '',
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin-stocks', filters],
        queryFn: () => FetchStockDataApi(filters),
        placeholderData: keepPreviousData,
    });

    const statusMutation = useMutation({
        mutationFn: ({ symbol, updates }: { symbol: string, updates: any }) => UpdateStockStatusApi(symbol, updates),
        onMutate: async ({ symbol, updates }) => {
            await queryClient.cancelQueries({ queryKey: ['admin-stocks', filters] });
            const previousData = queryClient.getQueryData(['admin-stocks', filters]);

            // Optimistic update
            queryClient.setQueryData(['admin-stocks', filters], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map((stock: Stock) => stock.symbol === symbol ? { ...stock, ...updates } : stock)
                };
            });

            return { previousData };
        },
        onError: (_err, _variables, context) => {
            queryClient.setQueryData(['admin-stocks', filters], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-stocks'] });
        }
    });

    const stocks = useMemo(() => data?.data ?? [], [data]);
    const total = data?.total ?? 0;

    const updateFilters = (updates: Partial<StockFilters>) => {
        setFilters((prev) => ({
            ...prev,
            ...updates,
            page: updates.page ?? 1,
        }));
    };

    const debouncedSearch = useDebouncedCallback((search: string) => updateFilters({ search }), 400);

    const handleStatusToggle = (symbol: string, statusKey: 'isTradable' | 'isTracked' | 'isVisible', newValue: boolean) => {
        statusMutation.mutate({ symbol, updates: { [statusKey]: newValue } });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-white">Stock Management</h1>
                <p className="text-xs text-neutral-400">
                    Manage the dataset of stocks, their visibility, and trading permissions ({total.toLocaleString()} total)
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-[#111] p-4 rounded-xl border border-neutral-800">
                <input 
                    type="text" 
                    placeholder="Search Symbol or Name..." 
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="bg-transparent border border-neutral-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-64 p-2.5 outline-none"
                />

                <select 
                    onChange={(e) => updateFilters({ exchange: e.target.value })}
                    className="bg-transparent border border-neutral-700 text-white text-sm rounded-lg block p-2.5 outline-none"
                    defaultValue=""
                >
                    <option value="" className="bg-neutral-900">All Exchanges</option>
                    <option value="US" className="bg-neutral-900">US</option>
                </select>

                <select 
                    onChange={(e) => updateFilters({ isTradable: e.target.value })}
                    className="bg-transparent border border-neutral-700 text-white text-sm rounded-lg block p-2.5 outline-none"
                    defaultValue=""
                >
                    <option value="" className="bg-neutral-900">Tradable: All</option>
                    <option value="true" className="bg-neutral-900">Tradable: Active</option>
                    <option value="false" className="bg-neutral-900">Tradable: Disabled</option>
                </select>

                <select 
                    onChange={(e) => updateFilters({ isTracked: e.target.value })}
                    className="bg-transparent border border-neutral-700 text-white text-sm rounded-lg block p-2.5 outline-none"
                    defaultValue=""
                >
                    <option value="" className="bg-neutral-900">Tracked: All</option>
                    <option value="true" className="bg-neutral-900">Tracked: Active</option>
                    <option value="false" className="bg-neutral-900">Tracked: Disabled</option>
                </select>

                <select 
                    onChange={(e) => updateFilters({ isVisible: e.target.value })}
                    className="bg-transparent border border-neutral-700 text-white text-sm rounded-lg block p-2.5 outline-none"
                    defaultValue=""
                >
                    <option value="" className="bg-neutral-900">Visible: All</option>
                    <option value="true" className="bg-neutral-900">Visible: Active</option>
                    <option value="false" className="bg-neutral-900">Visible: Disabled</option>
                </select>
            </div>

            <div className="bg-[#111] rounded-xl overflow-hidden shadow-sm">
                <StockTable 
                    stocks={stocks} 
                    isLoading={isLoading} 
                    isError={isError} 
                    onStatusToggle={handleStatusToggle} 
                />

                {!isLoading && !isError && stocks.length > 0 && (
                    <div className="p-4 border-t border-neutral-800">
                        <Pagination
                            page={filters.page as number}
                            limit={filters.limit as number}
                            total={total}
                            onPageChange={(page) => updateFilters({ page })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
