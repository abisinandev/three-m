import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, TrendingUp, TrendingDown, Clock, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { INDICES, RECENT_ACTIVITY } from '@shared/constants/dummyStocks';
import { FetchUserStocksApi } from '@shared/services/user/stocks/FetchUserStocksApi';
import type { UserStockFilters, StockListResponse } from '@shared/services/user/stocks/FetchUserStocksApi';
import type { Stock } from '@shared/components/interfaces/IStockTable';
import { Pagination } from '@shared/components/pagination/Pagination';
import { socket } from '@socket';
import stockCurrencyService from '@shared/services/stockCurrency.service';

const Sparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 24;
  const width = 60;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const color = positive ? '#22C55E' : '#ef4444';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TradingDashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');

  const [filters, setFilters] = useState<UserStockFilters>({
    page: 1,
    limit: 20,
    search: '',
    exchange: '',
  });

  const updateFilters = (updates: Partial<UserStockFilters>) => {
    setFilters(prev => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  };

  const debouncedSearch = useDebouncedCallback((search: string) => updateFilters({ search }), 400);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-stocks', filters],
    queryFn: () => FetchUserStocksApi(filters),
    placeholderData: keepPreviousData,
  });

  const stocks = useMemo(() => data?.data?.data ?? [], [data]);
  const total = data?.data?.total ?? 0;

  const filtersRef = useRef(filters);
  useEffect(() => { filtersRef.current = filters; }, [filters]);

  useEffect(() => {
    const handleStockUpdate = (trade: Pick<Stock, 'symbol' | 'price'>) => {
      console.log('[socket] stock-update received', trade);
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

    socket.on('connect', () => console.log('[socket] connected', socket.id));
    socket.on('disconnect', (reason) => console.warn('[socket] disconnected', reason));
    socket.on('connect_error', (err) => console.error('[socket] connect_error', err.message));
    socket.on('stock-update', handleStockUpdate);

    return () => {
      socket.off('stock-update', handleStockUpdate);
    };

  }, [queryClient]);

  return (
    <div className="min-h-screen bg-black text-white font-inter pb-10">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trading Overview</h2>
          <p className="text-sm text-gray-400 mt-1">Monitor your favorite stocks and execute trades.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stocks, ETFs..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#22C55E] transition-colors placeholder:text-gray-600"
            />
          </div>
          <button className="bg-[#0f0f0f] border border-[#2a2a2a] p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">

        <div className="flex-1 space-y-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
              {[
                { id: 'all', label: 'All Stocks' },
                { id: 'watchlist', label: 'Watchlist' },
                { id: 'gainers', label: 'Top Gainers' },
                { id: 'losers', label: 'Top Losers' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'bg-[#22C55E] text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                    : 'bg-[#111] text-gray-400 hover:text-white border border-[#2a2a2a] hover:border-[#444]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#0f0f0f] border border-[#1f1f1f] px-3 py-1.5 rounded hover:bg-[#1a1a1a] transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Market: NSE
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1f1f1f] text-xs text-gray-500 uppercase tracking-widest bg-[#0a0a0a]">
                    <th className="px-5 py-4 font-medium">Asset</th>
                    <th className="px-5 py-4 font-medium text-right">Price</th>
                    <th className="px-5 py-4 font-medium text-right">24h Change</th>
                    <th className="px-5 py-4 font-medium text-center">Trend (7d)</th>
                    <th className="px-5 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {isLoading && (
                    <tr>
                      <td colSpan={5} className="px-5 py-4 text-center">
                        <div className="animate-pulse flex flex-col space-y-4">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-10 bg-neutral-800 rounded-md w-full"></div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  {isError && (
                    <tr>
                      <td colSpan={5} className="px-5 py-4 text-center text-red-500">
                        Failed to load stocks.
                      </td>
                    </tr>
                  )}
                  {!isLoading && !isError && stocks.map((stock: Stock) => {
                    const price = stock.price ?? 0;
                    const changePercent = 0;
                    const change = 0;
                    const isPositive = changePercent >= 0;
                    return (
                      <tr
                        key={stock.symbol}
                        className="hover:bg-[#151515] transition-colors group"
                      >
                        <td
                          className="px-5 py-4 cursor-pointer"
                          onClick={() => navigate({ to: '/user/trading/$symbol', params: { symbol: stock.symbol } })}
                        >
                          <div className="flex items-center gap-3">
                            {stock.logo ? (
                              <img src={stock.logo} alt={stock.symbol} className="w-8 h-8 rounded-full border border-neutral-700 bg-white object-contain" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center font-bold text-xs">
                                {stock.symbol.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-sm text-gray-100">{stock.symbol}</div>
                              <div className="text-xs text-gray-500 max-w-[150px] truncate" title={stock.name}>{stock.name}</div>
                            </div>
                          </div>
                        </td>
                        <td
                          className="px-5 py-4 text-right cursor-pointer"
                          onClick={() => navigate({ to: '/user/trading/$symbol', params: { symbol: stock.symbol } })}
                        >
                          <div className="font-medium text-sm">{stockCurrencyService.formatCurrency(price, 'INR')}</div>
                        </td>
                        <td
                          className="px-5 py-4 text-right cursor-pointer"
                          onClick={() => navigate({ to: '/user/trading/$symbol', params: { symbol: stock.symbol } })}
                        >
                          <div className={`flex items-center justify-end gap-1 text-sm font-medium ${isPositive ? 'text-[#22C55E]' : 'text-red-500'}`}>
                            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {isPositive ? '+' : ''}₹{change.toFixed(2)}
                          </div>
                        </td>
                        <td
                          className="px-5 py-4 cursor-pointer"
                          onClick={() => navigate({ to: '/user/trading/$symbol', params: { symbol: stock.symbol } })}
                        >
                          <div className="flex justify-center">
                            <Sparkline data={[0, 10, 5, 20, -5, 10]} positive={isPositive} />
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate({ to: '/user/trading/$symbol', params: { symbol: stock.symbol } });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold transition-all border border-white/10"
                            >
                              VIEW
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!isLoading && !isError && stocks.length === 0 && (
                <div className="text-center py-10 text-gray-500 text-sm">
                  No stocks found matching your search.
                </div>
              )}
            </div>

            {!isLoading && !isError && stocks.length > 0 && (
              <div className="p-4 border-t border-[#1f1f1f] bg-[#0a0a0a]">
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

        {/* Right Sidebar */}
        <div className="w-full xl:w-80 space-y-6">

          {/* Indices Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest pl-1">Market Indices</h3>
            {INDICES.map((index, i) => {
              const isPositive = index.changePercent >= 0;
              return (
                <div key={i} className="bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-xl border border-[#1f1f1f] p-4 hover:border-[#333] transition-colors relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/5 to-transparent blur-2xl group-hover:from-white/10 transition-all" />
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <span className="text-sm font-medium text-gray-300">{index.name}</span>
                    <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-[#22C55E]' : 'text-red-500'}`}>
                      {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {Math.abs(index.changePercent).toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-xl font-bold tracking-tight relative z-10">
                    {index.name.includes('BTC') ? '₹' : ''}{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs mt-1 relative z-10 ${isPositive ? 'text-[#22C55E]' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{index.change.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-semibold text-gray-200">Recent Activity</h3>
              <button className="text-xs text-[#22C55E] hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {RECENT_ACTIVITY.map((activity, i) => (
                <div
                  key={i}
                  onClick={() => navigate({ to: '/user/trading/$symbol', params: { symbol: activity.symbol } })}
                  className="flex gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="mt-0.5">
                    {activity.type === 'buy' && <div className="w-6 h-6 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]"><TrendingUp className="w-3 h-3" /></div>}
                    {activity.type === 'sell' && <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><TrendingDown className="w-3 h-3" /></div>}
                    {activity.type === 'view' && <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><Clock className="w-3 h-3" /></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">
                        {activity.type === 'buy' ? 'Bought' : activity.type === 'sell' ? 'Sold' : 'Viewed'} <span className="text-white">{activity.symbol}</span>
                      </p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    {activity.qty && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activity.qty} shares @ ₹{activity.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboardPage;
