import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { FetchAdminAllTrades } from '@/shared/services/admin/algo-trading/admin-algo-trading-api';

export const useAdminTrades = () => {
    const [page, setPage] = useState(1);
    const [search, setSearchRaw] = useState('');
    const [type, setType] = useState('All'); // 'All', 'Manual', 'Algo'
    const [debouncedSearch] = useDebounce(search, 500);

    const setSearch = (value: string) => {
        setSearchRaw(value);
        setPage(1);
    };

    const {
        data: tradesData,
        isLoading,
        refetch,
        isFetching
    } = useQuery({
        queryKey: ['admin-all-trades', page, debouncedSearch, type],
        queryFn: () => FetchAdminAllTrades({ page, limit: 10, search: debouncedSearch, type }),
    });

    const handleNextPage = () => {
        const totalPages = tradesData?.data?.totalPages || 1;
        if (page < totalPages) setPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleTypeChange = (newType: string) => {
        setType(newType);
        setPage(1);
    };

    return {
        page,
        setPage,
        search,
        setSearch,
        type,
        handleTypeChange,
        handleNextPage,
        handlePrevPage,
        refetch,
        isLoading,
        isFetching,
        totalPages: tradesData?.data?.totalPages || 1,
        totalItems: tradesData?.data?.total || 0,
        items: tradesData?.data?.data || []
    };
};
