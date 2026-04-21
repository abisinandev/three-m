import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    getPortfolioSummary,
    // getPortfolioProjection,
    // getTradeHistory,
    // getMFHoldings,
    // getStockHoldings,
} from '@shared/services/feature/portfolio/PortfolioApi';
import type {
    IPortfolioSummaryResponse,
    // IPortfolioProjectionResponse,
} from '@shared/types/portfolio.types';
import api from '@lib/axiosUser';
import { PORTFOLIO_LIMIT, type PortfolioTab } from '../constants/portfolio.constants';

export const usePortfolio = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<PortfolioTab>('all');
    const [returnType, setReturnType] = useState<'Absolute' | 'XIRR'>('Absolute');

    const limit = PORTFOLIO_LIMIT;

    // Commenting out detailed holdings/history/projection as per request to focus on Summary API
    const mfData: any = null;
    const stockData: any = null;
    const projectionData: any = null;
    const tradeHistory: any = null;
    const xirrData: any = null;

    /*
    const { data: mfData, isLoading: isMfLoading, isError: isMfError, error: mfError } =
        useQuery({
            queryKey: ['portfolio', 'mf', page, limit, search],
            queryFn: () => getMFHoldings(page, limit, search),
            enabled: activeTab === 'all' || activeTab === 'mf',
            staleTime: 5 * 60 * 1000,
        });

    const { data: stockData, isLoading: isStockLoading, isError: isStockError, error: stockError } =
        useQuery({
            queryKey: ['portfolio', 'stocks', page, limit, search],
            queryFn: () => getStockHoldings(page, limit, search),
            enabled: activeTab === 'all' || activeTab === 'stocks',
            staleTime: 5 * 60 * 1000,
        });
    */

    const { data: summaryData, isLoading: isSummaryLoading } =
        useQuery<IPortfolioSummaryResponse>({
            queryKey: ['portfolio', 'summary'],
            queryFn: getPortfolioSummary,
            staleTime: 5 * 60 * 1000,
        });

    /*
    const { data: xirrData } = useQuery({
        queryKey: ['portfolio-key'],
        queryFn: async () => await api.get('/user/portfolio/return-xirr'),
    });

    const { data: projectionData, isLoading: isProjectionLoading } =
        useQuery<IPortfolioProjectionResponse>({
            queryKey: ['portfolio', 'projection'],
            queryFn: getPortfolioProjection,
            staleTime: 5 * 60 * 1000,
        });

    const { data: tradeHistory, isLoading: isHistoryLoading } = useQuery({
        queryKey: ['portfolio', 'trades', page, limit],
        queryFn: () => getTradeHistory(page, limit),
        enabled: activeTab === 'history',
    });
    */

    const investments = useMemo(() => {
        if (activeTab === 'mf') return mfData?.data || [];
        if (activeTab === 'stocks') return stockData?.data || [];
        if (activeTab === 'all') return [...(mfData?.data || []), ...(stockData?.data || [])];
        if (activeTab === 'history') return tradeHistory?.data || [];
        return [];
    }, [activeTab, mfData, stockData, tradeHistory]);

    const totalCount = useMemo(() => {
        if (activeTab === 'mf') return mfData?.total || 0;
        if (activeTab === 'stocks') return stockData?.total || 0;
        if (activeTab === 'history') return tradeHistory?.total || 0;
        return (mfData?.total || 0) + (stockData?.total || 0);
    }, [activeTab, mfData, stockData, tradeHistory]);

    const isMfLoading = false;
    const isStockLoading = false;
    const isHistoryLoading = false;
    const isProjectionLoading = false;
    const isStockError = false;
    const isMfError = false;
    const stockError = null;
    const mfError = null;

    const isLoading = isMfLoading || isStockLoading || isSummaryLoading;
    const isError = activeTab === 'stocks' ? isStockError : activeTab === 'mf' ? isMfError : (isStockError || isMfError);
    const error = activeTab === 'stocks' ? stockError : mfError;

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
        mfData,
        stockData,
        summaryData,
        xirrData,
        projectionData,
        tradeHistory,
        investments,
        totalCount,

        isLoading,
        isHistoryLoading,
        isProjectionLoading,
        isError,
        error,

        handlePageChange,
    };
};
