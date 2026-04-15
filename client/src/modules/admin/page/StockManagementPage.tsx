import { useState, useMemo } from 'react';
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { Pagination } from '@shared/components/pagination/Pagination';
import { FetchStockDataApi } from '@shared/services/admin/stock-management/FetchStockDataApi';
import type { StockFilters } from '@shared/services/admin/stock-management/FetchStockDataApi';
import { UpdateStockStatusApi } from '@shared/services/admin/stock-management/UpdateStockStatusApi';
import { StockTable } from '../components/StockTable';
import type { Stock } from '@shared/components/interfaces/IStockTable';
import { Search } from 'lucide-react';

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
        <div
            style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                minHeight: '100vh',
                background: '#00000',
                color: '#e8eaed',
                paddingBottom: 40
            }}
        >
            <div className="px-6 pt-6 max-w-[1600px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', letterSpacing: '-0.2px', margin: 0 }}>
                            Stock Management
                        </h1>
                        <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0 }}>
                            Configuration for {total.toLocaleString()} assets across markets.
                        </p>
                    </div>

                    <div style={{ fontSize: 10, color: '#5a5f6e', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Admin Console / Stocks
                    </div>
                </div>

                {/* Filters Bar */}
                <div
                    style={{
                        background: '#111214',
                        border: '1px solid #1e2025',
                        borderRadius: 8,
                        padding: '12px 16px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 12
                    }}
                >
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5f6e] w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder="Search by Symbol or Name..."
                            onChange={(e) => debouncedSearch(e.target.value)}
                            style={{
                                width: '100%',
                                background: '#0b0c0e',
                                border: '1px solid #1e2025',
                                borderRadius: 6,
                                padding: '7px 10px 7px 32px',
                                fontSize: 12,
                                color: '#e8eaed',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <FilterSelect
                        label="Exchange"
                        value={filters.exchange as string}
                        onChange={(v) => updateFilters({ exchange: v })}
                        options={[
                            { label: 'All Exchanges', value: '' },
                            { label: 'NSE', value: 'NSE' },
                            { label: 'BSE', value: 'BSE' },
                            { label: 'US Markets', value: 'US' },
                        ]}
                    />

                    <FilterSelect
                        label="Tradable"
                        value={filters.isTradable as string}
                        onChange={(v) => updateFilters({ isTradable: v })}
                        options={[
                            { label: 'All Status', value: '' },
                            { label: 'Active Only', value: 'true' },
                            { label: 'Disabled Only', value: 'false' },
                        ]}
                    />

                    <FilterSelect
                        label="Visibility"
                        value={filters.isVisible as string}
                        onChange={(v) => updateFilters({ isVisible: v })}
                        options={[
                            { label: 'All Items', value: '' },
                            { label: 'Visible', value: 'true' },
                            { label: 'Hidden', value: 'false' },
                        ]}
                    />
                </div>

                {/* Main Table Container */}
                <div style={{ background: '#111214', borderRadius: 8, border: '1px solid #1e2025', overflow: 'hidden' }}>
                    <StockTable
                        stocks={stocks}
                        isLoading={isLoading}
                        isError={isError}
                        onStatusToggle={handleStatusToggle}
                    />

                    {!isLoading && !isError && stocks.length > 0 && (
                        <div className="p-4 border-t border-[#1e2025] bg-[#0b0c0e]">
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
        </div>
    );
}

const FilterSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: { label: string, value: string }[] }) => (
    <div className="flex items-center gap-2">
        <span style={{ fontSize: 10, color: '#5a5f6e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}:</span>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                background: '#0b0c0e',
                border: '1px solid #1e2025',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 11,
                color: '#e8eaed',
                outline: 'none',
                cursor: 'pointer'
            }}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: '#111214' }}>{opt.label}</option>
            ))}
        </select>
    </div>
);
