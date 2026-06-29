import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { StockManagementApi } from '../services/StockManagementApi';
import { DEFAULT_FILTERS } from '../constants/stock-management.constants';
import type { Stock, StockFilters, StockPaginatedResponse, StockStatusKey } from '../types/stock-management.types';

export const useStockManagement = () => {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<StockFilters>(DEFAULT_FILTERS);

    const { data, isLoading, isError, refetch } = useQuery<StockPaginatedResponse>({
        queryKey: ['admin-stocks', filters],
        queryFn: () => StockManagementApi.fetchStocks(filters),
        placeholderData: keepPreviousData,
    });

    const statusMutation = useMutation({
        mutationFn: ({ symbol, updates }: { symbol: string, updates: Partial<Stock> }) =>
            StockManagementApi.updateStockStatus(symbol, updates),
        onMutate: async ({ symbol, updates }) => {
            await queryClient.cancelQueries({ queryKey: ['admin-stocks', filters] });
            const previousData = queryClient.getQueryData<StockPaginatedResponse>(['admin-stocks', filters]);

            queryClient.setQueryData<StockPaginatedResponse>(['admin-stocks', filters], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map((stock: Stock) =>
                        stock.symbol === symbol ? { ...stock, ...updates } : stock
                    )
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
    const totalPages = data?.totalPages ?? 0;
    const currentPage = data?.page ?? filters.page;

    // When changing any filter other than page, reset to page 1.
    // When explicitly changing the page, preserve the new page value.
    const updateFilters = (updates: Partial<StockFilters>) => {
        setFilters((prev) => {
            const isPageChange = 'page' in updates && Object.keys(updates).length === 1;
            return {
                ...prev,
                ...updates,
                page: isPageChange ? (updates.page ?? 1) : 1,
            };
        });
    };

    const debouncedSearch = useDebouncedCallback(
        (search: string) => updateFilters({ search }),
        400
    );

    const handleStatusToggle = (symbol: string, statusKey: StockStatusKey, newValue: boolean) => {
        statusMutation.mutate({ symbol, updates: { [statusKey]: newValue } });
    };

    return {
        filters,
        stocks,
        total,
        totalPages,
        currentPage,
        isLoading,
        isError,
        updateFilters,
        debouncedSearch,
        handleStatusToggle,
        refetch
    };
};
