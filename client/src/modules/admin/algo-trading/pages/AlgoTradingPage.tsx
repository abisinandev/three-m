import { RefreshCw } from 'lucide-react';
import { AlgoStats } from '../components/AlgoStats';
import { AlgoTabs } from '../components/AlgoTabs';
import { StrategiesTable } from '../components/StrategiesTable';
import { SignalsTable } from '../components/SignalsTable';
import BaseStrategiesRiskTable from '../components/BaseStrategiesRiskTable';
import { AlgoTradesTable } from '../components/AlgoTradesTable';
import { Pagination } from '@shared/components/pagination/Pagination';
import { useAlgoTrading } from '../hooks/useAlgoTrading';
import type { AdminStrategy, AdminSignal, AdminAlgoTrade } from '@/shared/types/admin/algo-trading.types';


const AlgoTradingPage = () => {
    const {
        activeTab,
        tabs,
        page,
        setPage,
        search,
        setSearch,
        handleTabChange,
        refetchAll,
        stats,
        items,
        totalItems,
        totalPages,
        isLoading,
        isFetching
    } = useAlgoTrading();

    return (
        <div
            style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                minHeight: '100vh',
                background: '#0b0c0e',
                color: '#e8eaed',
                paddingBottom: 40
            }}
        >
            <div className="px-6 pt-6 max-w-[1600px] mx-auto space-y-6">

                <div className="flex justify-between items-end">
                    <div>
                        <h1 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', letterSpacing: '-0.2px', margin: 0 }}>
                            Algo Trading Management
                        </h1>
                        <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0 }}>
                            Monitor live signals, manage strategy parameters, and track execution performance.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={refetchAll}
                            disabled={isFetching}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '6px 12px',
                                background: '#111214',
                                border: '1px solid #1e2025',
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#e8eaed',
                                cursor: isFetching ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
                            Sync Data
                        </button>
                    </div>
                </div>

                <AlgoStats stats={stats} />

                <AlgoTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                <div style={{ background: '#111214', borderRadius: 8, border: '1px solid #1e2025', overflow: 'hidden' }}>
                    {activeTab === 'Trades' ? (
                        <AlgoTradesTable
                            items={items as AdminAlgoTrade[]}
                            isLoading={isLoading}
                            search={search}
                            onSearchChange={setSearch}
                        />
                    ) : activeTab === 'Strategies' ? (
                        <StrategiesTable
                            items={items as AdminStrategy[]}
                            isLoading={isLoading}
                            search={search}
                            onSearchChange={setSearch}
                        />
                    ) : activeTab === 'Signals' ? (
                        <SignalsTable
                            items={items as AdminSignal[]}
                            isLoading={isLoading}
                            search={search}
                            onSearchChange={setSearch}
                        />
                    ) : activeTab === 'Risk Settings' ? (
                        <BaseStrategiesRiskTable />
                    ) : (
                        <div className="px-6 py-20 text-center">
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#5a5f6e' }}>System Logs</h3>
                            <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 4 }}>System logs module is currently being finalized.</p>
                        </div>
                    )}

                    {!isLoading && (activeTab === 'Strategies' || activeTab === 'Signals' || activeTab === 'Trades') && items.length > 0 && (
                        <Pagination
                            page={page}
                            limit={10}
                            total={totalItems}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            isLoading={isLoading}
                            unit={activeTab.toLowerCase()}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlgoTradingPage;
