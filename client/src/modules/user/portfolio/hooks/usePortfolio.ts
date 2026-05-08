import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    getPortfolioAssets,
    getMFHoldings,
    getStockHoldings,
    getPortfolioSummary,
    getHistories,
} from '@/shared/services/portfolio/portfolio-api';
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

    const { data: allAssetsData, isLoading: isAllLoading, isError: isAllError, error: allError } =
        useQuery({
            queryKey: ['portfolio', 'assets', 'all', page, limit, search],
            queryFn: () => getPortfolioAssets(page, limit, search, 'ALL'),
            enabled: activeTab === 'all',
            staleTime: 5 * 60 * 1000,
        });

    const { data: stockData, isLoading: isStockLoading, isError: isStockError, error: stockError } =
        useQuery({
            queryKey: ['portfolio', 'assets', 'stocks', page, limit, search],
            queryFn: () => getStockHoldings(page, limit, search),
            enabled: activeTab === 'stocks',
            staleTime: 5 * 60 * 1000,
        });

    const { data: mfData, isLoading: isMFLoading, isError: isMFError, error: mfError } =
        useQuery({
            queryKey: ['portfolio', 'assets', 'mf', page, limit, search],
            queryFn: () => getMFHoldings(page, limit, search),
            enabled: activeTab === 'mf',
            staleTime: 5 * 60 * 1000,
        });

    const { data: historyData, isLoading: isHistoryLoading, isError: isHistoryError, error: historyError } =
        useQuery({
            queryKey: ['portfolio', 'history', page, limit],
            queryFn: () => getHistories(page, limit),
            enabled: activeTab === 'history',
            staleTime: 5 * 60 * 1000,
        });

    const { data: summaryData, isLoading: isSummaryLoading } =
        useQuery<IPortfolioSummaryResponse>({
            queryKey: ['portfolio', 'summary'],
            queryFn: getPortfolioSummary,
            staleTime: 5 * 60 * 1000,
        });

    const activeData = useMemo(() => {
        if (activeTab === 'all') return allAssetsData;
        if (activeTab === 'stocks') return stockData;
        if (activeTab === 'mf') return mfData;
        return undefined;
    }, [activeTab, allAssetsData, stockData, mfData]);

    const investments = useMemo(() => activeData?.data ?? [], [activeData]);
    const totalCount = useMemo(() => activeData?.total ?? 0, [activeData]);

    const isAssetsLoading = isAllLoading || isStockLoading || isMFLoading;
    const isLoading = isAssetsLoading || isSummaryLoading;

    const isError = useMemo(() => {
        if (activeTab === 'all') return isAllError;
        if (activeTab === 'stocks') return isStockError;
        if (activeTab === 'mf') return isMFError;
        if (activeTab === 'history') return isHistoryError;
        return false;
    }, [activeTab, isAllError, isStockError, isMFError, isHistoryError]);

    const error = useMemo(() => {
        if (activeTab === 'all') return allError;
        if (activeTab === 'stocks') return stockError;
        if (activeTab === 'mf') return mfError;
        if (activeTab === 'history') return historyError;
        return null;
    }, [activeTab, allError, stockError, mfError, historyError]);

    const handleTabChange = (tab: PortfolioTab) => {
        setActiveTab(tab);
        setPage(1);
        setSearch('');
    };

    const handlePageChange = (newPage: number) => {
        const dataTotal = activeTab === 'history' ? (historyData?.total ?? 0) : totalCount;
        const maxPage = Math.ceil(dataTotal / limit);
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
        setActiveTab: handleTabChange,
        returnType,
        setReturnType,
        limit,

        // Data per tab
        summaryData,
        investments,
        totalCount,
        historyData,

        // Loading / error
        isLoading: activeTab === 'history' ? false : isLoading,
        isAssetsLoading,
        isHistoryLoading,
        isSummaryLoading,
        isError,
        error,

        handlePageChange,
    };
};

