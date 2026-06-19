import { RefreshCw, Activity } from 'lucide-react';
import { TradesTable } from '../components/TradesTable';
import { AlgoPagination } from '@/modules/admin/algo-trading/components/AlgoPagination';
import { useAdminTrades } from '../hooks/useAdminTrades';

const AdminTradesPage = () => {
    const {
        page,
        search,
        setSearch,
        type,
        handleTypeChange,
        handleNextPage,
        handlePrevPage,
        refetch,
        items,
        totalItems,
        totalPages,
        isLoading,
        isFetching
    } = useAdminTrades();

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
                            Trade Management
                        </h1>
                        <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0 }}>
                            Monitor and analyze all trading activity across the platform.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => refetch()}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[11px] text-[#5a5f6e] uppercase tracking-wider font-semibold mb-1">Total Trades</p>
                                <h3 className="text-2xl font-bold text-[#e8eaed]">{totalItems}</h3>
                            </div>
                            <div className="p-2 bg-[#2b2d35]/30 rounded-md">
                                <Activity size={16} className="text-[#8b92a5]" />
                            </div>
                        </div>
                        <p className="text-xs text-[#5a5f6e]">Current filter set total</p>
                    </div>
                </div>

                <div style={{ background: '#111214', borderRadius: 8, border: '1px solid #1e2025', overflow: 'hidden' }}>
                    <TradesTable
                        items={items}
                        isLoading={isLoading}
                        search={search}
                        onSearchChange={setSearch}
                        type={type}
                        onTypeChange={handleTypeChange}
                    />

                    {!isLoading && items.length > 0 && (
                        <AlgoPagination
                            page={page}
                            totalPages={totalPages}
                            itemsCount={items.length}
                            totalItems={totalItems}
                            unit="trades"
                            isLoading={isLoading}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTradesPage;
