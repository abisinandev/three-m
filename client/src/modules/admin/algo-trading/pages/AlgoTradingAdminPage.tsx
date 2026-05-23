import { useState } from 'react';
import {
  RefreshCw, Plus, Cpu, Activity, BarChart2,
  AlertTriangle, Clock, Search, Edit2, ExternalLink,
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';
import {
  FetchAdminAlgoStats,
  FetchAdminSignals,
  FetchAdminStrategies,
  FetchAdminAlgoTrades
} from '@/shared/services/admin/algo-trading/admin-algo-trading-api';
import BaseStrategiesRiskTable from '../components/BaseStrategiesRiskTable';
import type { AdminStrategy, AdminSignal, AdminAlgoTrade, AlgoTabName as TabName } from '@/shared/types/admin/algo-trading.types';

const AlgoTradingAdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Strategies');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const tabs: TabName[] = ['Strategies', 'Signals', 'Trades', 'Risk Settings'];

  const { data: statsData, refetch: refetchStats } = useQuery({
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

  const handleNextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
    setPage(1);
    setSearch('');
  };

  const stats = statsData?.data || {};

  const getCurrentData = () => {
    if (activeTab === 'Strategies') return strategiesData?.data;
    if (activeTab === 'Signals') return signalsData?.data;
    if (activeTab === 'Trades') return tradesData?.data;
    return null;
  };

  const currentData = getCurrentData();
  const isLoading = activeTab === 'Strategies' ? isLoadingStrategies : activeTab === 'Signals' ? isLoadingSignals : activeTab === 'Trades' ? isLoadingTrades : false;
  const isFetching = activeTab === 'Strategies' ? isFetchingStrategies : activeTab === 'Signals' ? isFetchingSignals : activeTab === 'Trades' ? isFetchingTrades : false;

  const refetchAll = () => {
    refetchStats();
    if (activeTab === 'Strategies') refetchStrategies();
    if (activeTab === 'Signals') refetchSignals();
    if (activeTab === 'Trades') refetchTrades();
  };

  const totalPages = currentData?.totalPages || 1;
  const totalItems = currentData?.total || 0;
  const items = currentData?.data || [];

  const colSpan = activeTab === 'Strategies' ? 5 : activeTab === 'Signals' ? 6 : activeTab === 'Trades' ? 7 : 1;

  return (
    <div className="bg-black min-h-full font-sans text-white">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-1">Algo Trading Management</h1>
          <p className="text-neutral-400 text-[13px]">Monitor signals, manage strategies, and view algo trade history.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refetchAll}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md border border-neutral-700 text-[13px] font-medium transition-colors disabled:opacity-50"
            disabled={isFetching}
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            Refresh Data
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[13px] font-medium transition-colors">
            <Plus size={14} />
            Create Strategy
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatCard title="ACTIVE STRATEGIES" value={stats.activeStrategiesCount?.toString() || "—"} subtitle="Live data" icon={<Cpu size={16} className="text-emerald-500" />} valueClass="text-white" />
        <StatCard title="TOTAL SIGNALS" value={stats.activeSignalsCount?.toString() || "—"} subtitle="All signals" icon={<Activity size={16} className="text-emerald-500" />} valueClass="text-white" />
        <StatCard title="TRADES EXECUTED TODAY" value={stats.tradesExecutedTodayCount?.toString() || "—"} subtitle="Live data" icon={<BarChart2 size={16} className="text-emerald-500" />} valueClass="text-white" />
        <StatCard title="FAILED TRADES" value={stats.failedTradesCount?.toString() || "—"} subtitle="Live data" icon={<AlertTriangle size={16} className="text-emerald-500" />} valueClass="text-red-500" alertIcon />
        <div className="bg-[#18181B] rounded-lg p-4 flex flex-col justify-between border border-neutral-800 min-h-[110px]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[11px] font-medium text-neutral-500 tracking-wider">MARKET STATUS</h3>
            <div className="p-1.5 bg-neutral-800/50 rounded-md"><Clock size={16} className="text-emerald-500" /></div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-500 mb-1 leading-none tracking-wide text-center uppercase">{stats.marketStatus || "OPEN"}</div>
            <div className="text-[11px] text-neutral-500">NSE / BSE</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#18181B] border border-neutral-800 p-1 rounded-lg w-max shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${activeTab === tab ? 'bg-emerald-500/10 text-emerald-500' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-[#18181B] rounded-xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181B]">
          <h2 className="text-[14px] font-semibold text-white uppercase tracking-wider">{activeTab}</h2>
          {(activeTab === 'Strategies' || activeTab === 'Signals' || activeTab === 'Trades') && (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 pr-3 py-1.5 bg-neutral-800/80 border border-neutral-700/80 rounded-md text-[13px] text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 w-[240px] placeholder-neutral-500 transition-all font-medium"
              />
            </div>
          )}
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'Risk Settings' ? (
            <BaseStrategiesRiskTable />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-[#18181B]">
                    {activeTab === 'Strategies' ? (
                      <>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Strategy Name</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Status</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Users Count</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Last Signal Time</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider text-right uppercase">Actions</th>
                      </>
                    ) : activeTab === 'Signals' ? (
                      <>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">ID / Symbol</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Strategy</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Action</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Price</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Status</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Created At</th>
                      </>
                    ) : activeTab === 'Trades' ? (
                      <>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Trade ID</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Symbol</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Side</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Quantity</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Price</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">P&L</th>
                        <th className="px-6 py-3 text-[11px] text-neutral-500 font-medium tracking-wider uppercase">Executed At</th>
                      </>
                    ) : (
                      <th className="px-6 py-10 text-center text-neutral-600 font-medium">This module is under development</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-[#18181B]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={colSpan} className="px-6 py-20 text-center text-neutral-400 text-[13px]">
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw size={24} className="animate-spin text-emerald-500/50" />
                          <span>Loading {activeTab.toLowerCase()}...</span>
                        </div>
                      </td>
                    </tr>
                  ) : items.length === 0 && (activeTab === 'Strategies' || activeTab === 'Signals' || activeTab === 'Trades') ? (
                    <tr>
                      <td colSpan={colSpan} className="px-6 py-20 text-center text-neutral-400 text-[13px]">
                        <div className="flex flex-col items-center gap-2">
                          <Search size={24} className="text-neutral-700" />
                          <span>No {activeTab.toLowerCase()} found matching your criteria.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    (items as (AdminStrategy | AdminSignal | AdminAlgoTrade)[]).map((item) => {
                      const strategy = item as AdminStrategy;
                      const signal = item as AdminSignal;
                      const trade = item as AdminAlgoTrade;

                      return (
                        <tr key={item.id} className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors group">
                          {activeTab === 'Strategies' ? (
                            <>
                              <td className="px-6 py-4">
                                <div className="text-[13px] font-semibold text-white mb-0.5">{strategy.strategyName}</div>
                                <div className="text-[11px] text-neutral-500 font-mono tracking-tight">ID: {strategy.id}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${strategy.isActive ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${strategy.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3 w-40">
                                  <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((strategy.usersCount || 0) * 10, 100)}%` }} />
                                  </div>
                                  <span className="text-[13px] text-white font-medium w-4">{strategy.usersCount || 0}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-[13px] text-neutral-400">
                                {strategy.lastSignalTime ? dayjs(strategy.lastSignalTime).format('MMM DD, YYYY HH:mm') : '—'}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1.5 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-md transition-colors border border-transparent hover:border-neutral-600"><Edit2 size={14} /></button>
                                  <button className="p-1.5 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-md transition-colors border border-transparent hover:border-neutral-600"><ExternalLink size={14} /></button>
                                </div>
                              </td>
                            </>
                          ) : activeTab === 'Signals' ? (
                            <>
                              <td className="px-6 py-4">
                                <div className="text-[13px] font-semibold text-white mb-0.5">{signal.symbol}</div>
                                <div className="text-[11px] text-neutral-500 font-mono tracking-tight">{signal.id}</div>
                              </td>
                              <td className="px-6 py-4 text-[13px] text-neutral-300 font-medium">{signal.strategyName}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${signal.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{signal.action}</span>
                              </td>
                              <td className="px-6 py-4 text-[13px] font-mono text-white">₹{parseFloat(String(signal.price)).toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${signal.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : signal.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : signal.status === 'EXPIRED' ? 'bg-neutral-700 text-neutral-300' : 'bg-amber-500/10 text-amber-500'}`}>{signal.status}</span>
                              </td>
                              <td className="px-6 py-4 text-[12px] text-neutral-400">{dayjs(signal.createdAt).format('MMM DD, HH:mm')}</td>
                            </>
                          ) : activeTab === 'Trades' ? (
                            <>
                              <td className="px-6 py-4">
                                <div className="text-[11px] text-neutral-500 font-mono tracking-tight">{trade.id}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-[13px] font-bold text-white">{trade.symbol}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${trade.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {trade.side === 'BUY' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                  {trade.side}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-[13px] text-neutral-300">{trade.quantity}</td>
                              <td className="px-6 py-4 text-[13px] font-mono text-white">₹{parseFloat(String(trade.price)).toLocaleString()}</td>
                              <td className="px-6 py-4">
                                {trade.profit != null ? (
                                  <span className={`text-[13px] font-bold font-mono ${Number(trade.profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {Number(trade.profit || 0) >= 0 ? '+' : ''}₹{parseFloat(String(trade.profit || 0)).toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-[12px] text-neutral-600">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-[12px] text-neutral-400">{dayjs(trade.createdAt).format('MMM DD, HH:mm')}</td>
                            </>
                          ) : null}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {(activeTab === 'Strategies' || activeTab === 'Signals' || activeTab === 'Trades') && (
          <div className="p-4 border-t border-neutral-800 flex justify-between items-center text-[12px] text-neutral-500 bg-[#18181B]">
            <div className="font-medium bg-neutral-800/30 px-2 py-1 rounded">
              Showing <span className="text-white">{items.length}</span> of <span className="text-white">{totalItems}</span> {activeTab.toLowerCase()}
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="mr-2">Page {page} of {totalPages}</span>
              <button onClick={handlePrevPage} disabled={page === 1 || isLoading} className="p-1.5 bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded-md transition-all shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <button onClick={handleNextPage} disabled={page >= totalPages || isLoading} className="p-1.5 bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded-md transition-all shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  valueClass?: string;
  alertIcon?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, valueClass = "text-white", alertIcon = false }) => (
  <div className="bg-[#18181B] rounded-lg p-4 flex flex-col justify-between border border-neutral-800 min-h-[110px] shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-[11px] font-medium text-neutral-500 tracking-wider uppercase">{title}</h3>
      <div className={`p-1.5 rounded-md ${alertIcon ? 'bg-red-500/10' : 'bg-neutral-800/50'}`}>{icon}</div>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <div className={`text-xl font-bold mb-1 leading-none tracking-tight ${valueClass}`}>
          {value === '—' ? <div className="w-8 h-1 bg-neutral-800 rounded-full my-2"></div> : value}
        </div>
        <div className="text-[11px] text-neutral-500 font-medium">{subtitle}</div>
      </div>
    </div>
  </div>
);

export default AlgoTradingAdminPage;

