import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { FetchAdminAlgoStats, FetchAdminSignals, FetchAdminStrategies } from '@/shared/services/admin/algo-trading/AdminAlgoTradingApi';

export const useAlgoTrading = () => {
    const [activeTab, setActiveTab] = useState('Strategies');
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);

    const tabs = ['Strategies', 'Signals', 'Trades', 'User Access', 'Risk Settings', 'System Logs'];

    // Fetch Overall Stats
    const { 
        data: statsData, 
        refetch: refetchStats, 
        isFetching: isFetchingStats 
    } = useQuery({
        queryKey: ['admin-algo-stats'],
        queryFn: FetchAdminAlgoStats,
    });

    // Fetch Strategies
    const {
        data: strategiesData,
        isLoading: isLoadingStrategies,
        refetch: refetchStrategies,
        isFetching: isFetchingStrategies
    } = useQuery({
        queryKey: ['admin-strategies', page, debouncedSearch],
        queryFn: () => FetchAdminStrategies({ page, limit: 10, search: debouncedSearch }),
        enabled: activeTab === 'Strategies',
    });

    // Fetch Signals
    const {
        data: signalsData,
        isLoading: isLoadingSignals,
        refetch: refetchSignals,
        isFetching: isFetchingSignals
    } = useQuery({
        queryKey: ['admin-signals', page, debouncedSearch],
        queryFn: () => FetchAdminSignals({ page, limit: 10, search: debouncedSearch }),
        enabled: activeTab === 'Signals',
    });

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setPage(1);
        setSearch('');
    };

    const handleNextPage = () => {
        const totalPages = activeTab === 'Strategies'
            ? (strategiesData?.data?.totalPages || 1)
            : (signalsData?.data?.totalPages || 1);

        if (page < totalPages) setPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const refetchAll = () => {
        refetchStats();
        if (activeTab === 'Strategies') refetchStrategies();
        if (activeTab === 'Signals') refetchSignals();
    };

    const currentData = activeTab === 'Strategies' ? strategiesData?.data : signalsData?.data;
    const isLoading = activeTab === 'Strategies' ? isLoadingStrategies : isLoadingSignals;
    const isFetching = isFetchingStats || (activeTab === 'Strategies' ? isFetchingStrategies : isFetchingSignals);

    return {
        activeTab,
        tabs,
        page,
        search,
        setSearch,
        handleTabChange,
        handleNextPage,
        handlePrevPage,
        refetchAll,
        stats: statsData?.data || {},
        currentData,
        isLoading,
        isFetching,
        totalPages: currentData?.totalPages || 1,
        totalItems: currentData?.total || 0,
        items: currentData?.data || []
    };
};
