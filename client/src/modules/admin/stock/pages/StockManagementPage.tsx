import { useState } from 'react';
import { Pagination } from '@shared/components/pagination/Pagination';
import { StockTable } from '../components/StockTable';
import { useStockManagement } from '../hooks/useStockManagement';
import { StockFilters } from '../components/StockFilters';
import { StockOnboardingModal } from '../components/StockOnboardingModal';
import { Plus } from 'lucide-react';

export default function StockManagementPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        filters,
        stocks,
        total,
        isLoading,
        isError,
        updateFilters,
        debouncedSearch,
        handleStatusToggle,
        refetch
    } = useStockManagement();

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
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div className="flex items-end gap-6">
                        <div>
                            <h1 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', letterSpacing: '-0.2px', margin: 0 }}>
                                Stock Management
                            </h1>
                            <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0 }}>
                                Configuration for {total.toLocaleString()} assets across markets.
                            </p>
                        </div>

                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-all shadow-lg shadow-teal-900/20 active:scale-95"
                        >
                            <Plus size={14} />
                            Onboard Assets
                        </button>
                    </div>
                    
                    <div style={{ fontSize: 10, color: '#5a5f6e', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Admin Console / Stocks
                    </div>
                </div>

                <StockOnboardingModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        refetch();
                    }}
                />

      
                <StockFilters 
                    onSearchChange={debouncedSearch}
                    exchange={filters.exchange}
                    onExchangeChange={(v) => updateFilters({ exchange: v })}
                    tradable={filters.isTradable}
                    onTradableChange={(v) => updateFilters({ isTradable: v })}
                    visible={filters.isVisible}
                    onVisibleChange={(v) => updateFilters({ isVisible: v })}
                />

                {/* Main Table Container */}
                <div style={{ background: '#111214', borderRadius: 8, border: '1px solid #1e2025', overflow: 'hidden' }}>
                    <StockTable 
                        stocks={stocks} 
                        isLoading={isLoading} 
                        isError={isError} 
                        onStatusToggle={handleStatusToggle} 
                    />

                    {!isLoading && !isError && stocks.length > 0 && (
                        <div className="p-4 border-t border-[#1e2025] bg-[#0b0c0e]">
                            <Pagination
                                page={filters.page}
                                limit={filters.limit}
                                total={total}
                                onPageChange={(page) => updateFilters({ page })}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
