import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, SlidersHorizontal, Filter, ChevronDown } from 'lucide-react';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

// Services & Hooks
import { FetchUserStocksApi } from '@shared/services/user/stocks/FetchUserStocksApi';
import { useGetWatchlist, useWatchlistMutation } from '@shared/hooks/useWatchlist';
import { getStockHoldings } from '@shared/services/feature/portfolio/PortfolioApi';
import { socket } from '@socket';

import { Pagination } from '@shared/components/pagination/Pagination';
import StockTable from '../components/stock-dashboard/StockTable';
import StockDashboardTabs from '../components/stock-dashboard/StockDashboardTabs';
import MarketMovers from '../components/stock-dashboard/MarketMovers';
import RecentActivity from '../components/stock-dashboard/RecentActivity';

import type { UserStockFilters, StockListResponse } from '@shared/services/user/stocks/FetchUserStocksApi';
import type { Stock } from '@shared/components/interfaces/IStockTable';
import type { DashboardTab } from '../types/stock-dashboard.types';
import { usePremiumModalStore } from '@stores/user/PremiumModalStore';

const TABS: DashboardTab[] = [
  { id: 'all', label: 'All Stocks' },
  { id: 'watchlist', label: 'Watchlist' }
];

const StockDashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('all');
  const { onOpen: openPremiumModal } = usePremiumModalStore();
  const [filters, setFilters] = useState<UserStockFilters>({
    page: 1,
    limit: 20,
    search: '',
  });

  const { data: stocksResponse, isLoading: isStocksLoading, isError: isStocksError } = useQuery({
    queryKey: ['user-stocks', filters],
    queryFn: () => FetchUserStocksApi(filters),
    placeholderData: keepPreviousData,
  });

  const { data: tradesResponse } = useQuery({
    queryKey: ['recent-trades'],
    queryFn: () => getStockHoldings(1, 10),
  });

  const { data: watchlistResponse, isLoading: isWatchlistLoading } = useGetWatchlist();
  
  const { add: addToWatchlist, remove: removeFromWatchlist } = useWatchlistMutation(openPremiumModal);

  const stocks = useMemo(() => {
    if (activeTab === 'watchlist') {
      return watchlistResponse?.data ?? [];
    }
    return stocksResponse?.data?.data ?? [];
  }, [stocksResponse, watchlistResponse, activeTab]);

  const watchlistSymbols = useMemo(() => {
      // Defensive check to ensure data is an array
      const list = watchlistResponse?.data;
      return new Set(Array.isArray(list) ? list.map(s => s.symbol) : []);
  }, [watchlistResponse]);

  const total = stocksResponse?.data?.total ?? 0;
  const recentTrades = useMemo(() => tradesResponse?.data ?? [], [tradesResponse]);

  const updateFilters = (updates: Partial<UserStockFilters>) => {
    setFilters(prev => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  };

  const debouncedSearch = useDebouncedCallback((search: string) => updateFilters({ search }), 400);

  const handleToggleWatchlist = (symbol: string) => {
    if (watchlistSymbols.has(symbol)) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist(symbol);
    }
  };

  const handleNavigate = (symbol: string) => {
    navigate({ to: '/user/trading/$symbol', params: { symbol } });
  };

  const filtersRef = useRef(filters);
  useEffect(() => { filtersRef.current = filters; }, [filters]);

  useEffect(() => {
    const handleStockUpdate = (trade: Pick<Stock, 'symbol' | 'price'>) => {
      queryClient.setQueryData<StockListResponse>(
        ['user-stocks', filtersRef.current],
        (old) => {
          if (!old || !old.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((stock: Stock) =>
                stock.symbol === trade.symbol
                  ? { ...stock, price: trade.price }
                  : stock
              ),
            },
          };
        }
      );
    };

    socket.on('stock-update', handleStockUpdate);
    return () => { socket.off('stock-update', handleStockUpdate); };
  }, [queryClient]);

  return (
    <div 
      className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] pb-10 selection:bg-[#2962ff]/30"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pt-6 px-6 max-w-[1600px] mx-auto">
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', letterSpacing: '-0.2px', margin: 0 }}>
            Stocks Dashboard
          </h2>
          <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0 }}>
            Monitor market conditions and execute trades instantly.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search stocks, ETFs..."
              onChange={(e) => debouncedSearch(e.target.value)}
              style={{
                  width: '100%',
                  background: '#111214',
                  border: '1px solid #1e2025',
                  borderRadius: 6,
                  padding: '7px 10px 7px 32px',
                  fontSize: 12,
                  color: '#e8eaed',
                  outline: 'none',
              }}
            />
          </div>
          <button className="bg-[#111214] border border-[#1e2025] p-2 rounded-md hover:bg-[#1a1c20] transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 px-6 max-w-[1600px] mx-auto">
        
        <div className="flex-1 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1e2025] pb-4">
            <StockDashboardTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              tabs={TABS} 
            />

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button className="flex items-center gap-1.5 text-xs text-[#5a5f6e] bg-[#111214] border border-[#1e2025] px-3 py-1.5 rounded hover:bg-[#1a1c20] transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Market: NSE
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-[#111214] rounded-lg border border-[#1e2025] overflow-hidden">
            <StockTable 
              stocks={stocks}
              isLoading={isStocksLoading || (activeTab === 'watchlist' && isWatchlistLoading)}
              isError={isStocksError}
              watchlistSymbols={watchlistSymbols}
              onToggleWatchlist={handleToggleWatchlist}
              onNavigate={handleNavigate}
            />

            {!isStocksLoading && !isStocksError && activeTab === 'all' && stocks.length > 0 && (
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

        <div className="w-full xl:w-80 space-y-6">
          <MarketMovers 
            onNavigate={handleNavigate} 
          />
          
          <RecentActivity 
            trades={recentTrades} 
            onNavigate={handleNavigate} 
          />
        </div>
      </div>
      
    </div>
  );
};

export default StockDashboardPage;
