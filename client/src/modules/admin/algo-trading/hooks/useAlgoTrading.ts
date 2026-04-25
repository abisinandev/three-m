import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { FetchAdminAlgoStats, FetchAdminSignals, FetchAdminStrategies, FetchAdminAlgoTrades } from '@/shared/services/admin/algo-trading/AdminAlgoTradingApi';


export const useAlgoTrading = () => {
    const [activeTab, setActiveTab] = useState('Strategies');
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);

    const tabs = ['Strategies', 'Signals', 'Trades', 'Risk Settings', 'System Logs'];

    const {
        data: statsData,
        refetch: refetchStats,
        isFetching: isFetchingStats
    } = useQuery({
        queryKey: ['admin-algo-stats'],
        queryFn: FetchAdminAlgoStats,
    });

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

    const {
        data: tradesData,
        isLoading: isLoadingTrades,
        refetch: refetchTrades,
        isFetching: isFetchingTrades
    } = useQuery({
        queryKey: ['admin-algo-trades', page, debouncedSearch],
        queryFn: () => FetchAdminAlgoTrades({ page, limit: 10, search: debouncedSearch }),
        enabled: activeTab === 'Trades',
    });

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setPage(1);
        setSearch('');
    };

    const handleNextPage = () => {
        let totalPages = 1;
        if (activeTab === 'Strategies') totalPages = strategiesData?.data?.totalPages || 1;
        else if (activeTab === 'Signals') totalPages = signalsData?.data?.totalPages || 1;
        else if (activeTab === 'Trades') totalPages = tradesData?.data?.totalPages || 1;

        if (page < totalPages) setPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const refetchAll = () => {
        refetchStats();
        if (activeTab === 'Strategies') refetchStrategies();
        if (activeTab === 'Signals') refetchSignals();
        if (activeTab === 'Trades') refetchTrades();
    };

    const currentData = activeTab === 'Strategies'
        ? strategiesData?.data
        : activeTab === 'Signals'
            ? signalsData?.data
            : tradesData?.data;

    const isLoading = activeTab === 'Strategies'
        ? isLoadingStrategies
        : activeTab === 'Signals'
            ? isLoadingSignals
            : isLoadingTrades;

    const isFetching = isFetchingStats || (
        activeTab === 'Strategies' ? isFetchingStrategies :
            activeTab === 'Signals' ? isFetchingSignals :
                isFetchingTrades
    );

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
