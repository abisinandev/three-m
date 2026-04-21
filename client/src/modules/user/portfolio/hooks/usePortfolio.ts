import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    getPortfolioAssets,
    getPortfolioSummary,
    getTradeHistory,
} from '@shared/services/feature/portfolio/PortfolioApi';
import type {
    IPortfolioSummaryResponse,
} from '@shared/types/portfolio.types';
import { PORTFOLIO_LIMIT, type PortfolioTab } from '../constants/portfolio.constants';

export const usePortfolio = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<PortfolioTab>('all');
    const [returnType, setReturnType] = useState<'Absolute' | 'XIRR'>('Absolute');

    const limit = PORTFOLIO_LIMIT;

    const { data: assetsData, isLoading: isAssetsLoading, isError: isAssetsError, error: assetsError } =
        useQuery({
            queryKey: ['portfolio', 'assets', activeTab, page, limit, search],
            queryFn: () => getPortfolioAssets(page, limit, search,
                activeTab === 'all' ? 'ALL' : activeTab === 'mf' ? 'MF' : 'STOCK'
            ),
            enabled: activeTab !== 'history',
            staleTime: 5 * 60 * 1000,
        });

    const { data: tradeHistoryData, isLoading: isHistoryLoading, isError: isHistoryError, error: historyError } =
        useQuery({
            queryKey: ['portfolio', 'history', page, limit],
            queryFn: () => getTradeHistory(page, limit),
            enabled: activeTab === 'history',
            staleTime: 5 * 60 * 1000,
        });

    const { data: summaryData, isLoading: isSummaryLoading } =
        useQuery<IPortfolioSummaryResponse>({
            queryKey: ['portfolio', 'summary'],
            queryFn: getPortfolioSummary,
            staleTime: 5 * 60 * 1000,
        });

    const investments = useMemo(() => {
        return assetsData?.data || [];
    }, [assetsData]);

    const totalCount = useMemo(() => {
        return assetsData?.total || 0;
    }, [assetsData]);

    const isLoading = isAssetsLoading || isSummaryLoading;

    const handlePageChange = (newPage: number) => {
        const maxPage = Math.ceil(totalCount / limit);
        if (newPage >= 1 && newPage <= (maxPage || 1)) setPage(newPage);
    };

    return {
        page,
        setPage,
        search,
        setSearch,
        status,
        setStatus,
        activeTab,
        setActiveTab,
        returnType,
        setReturnType,
        limit,

        // Data
        summaryData,
        investments,
        totalCount,
        tradeHistoryData,

        isLoading,
        isHistoryLoading,
        isError: activeTab === 'history' ? isHistoryError : isAssetsError,
        error: activeTab === 'history' ? historyError : assetsError,

        handlePageChange,
    };
};
