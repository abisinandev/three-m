'use client';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useUserStore } from '@stores/user/UserStore';
import { ROUTES } from '@shared/constants/apiRoutes';
import { SummaryStats } from '../components/SummaryStats';
import { HoldingsFilters } from '../components/HoldingsFilters';
import { HoldingsTable } from '../components/HoldingsTable';
import { TradeHistoryTable } from '../components/TradeHistoryTable';
import { AssetAllocationDonut } from '../components/AssetAllocationDonut';
import { PortfolioXirrCard } from '../components/StatsSidebar';
import { usePremiumModalStore } from '@stores/user/PremiumModalStore';
import { usePortfolio } from '../hooks/usePortfolio';
import PendingOrdersTable from '../../stock/components/PendingOrdersTable';
import { PortfolioProjection } from '../components/PortfolioProjection';
import { toast } from 'sonner';


const PortfolioDashboard = () => {
    const user = useUserStore((state) => state.user);
    const navigate = useNavigate();
    const { onOpen: openPremiumModal } = usePremiumModalStore();

    const {
        page, setPage, search, setSearch, status, setStatus,
        activeTab, setActiveTab, returnType, setReturnType, limit,
        summaryData, investments, totalCount, historyData,
        isAssetsLoading, isHistoryLoading, isSummaryLoading, isError, error: _error, handlePageChange
    } = usePortfolio();

    const xirrValue = summaryData?.xirr ? Number(summaryData.xirr).toFixed(2) : '0.00';

    return (
        <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] font-sans pb-12">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 flex flex-col gap-4">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#e8eaed] tracking-tight m-0">
                            Portfolio
                        </h1>
                        <p className="text-sm text-[#5a5f6e] mt-1 m-0">
                            Holdings & performance
                        </p>
                    </div>

                    <div className="flex bg-[#111214] border border-[#1e2025] rounded-md p-0.5 gap-0.5">
                        {(['Absolute', 'XIRR'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setReturnType(t)}
                                className={`px-3 py-1.5 text-xs font-bold tracking-wider rounded border-none cursor-pointer transition-all duration-150 ${returnType === t ? 'bg-[#1e2025] text-[#e8eaed]' : 'bg-transparent text-[#5a5f6e]'}`}
                            >
                                {t.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {!user?.isSubscribed && (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-amber-500/10 flex items-center justify-center">
                                <span className="text-amber-500 text-xs font-black italic">P</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#e8eaed] m-0">Unlock Enhanced Intelligence</p>
                                <p className="text-xs text-[#5a5f6e] mt-0.5 m-0">Upgrade to Premium for advanced portfolio analytics, AI projections, and more.</p>
                            </div>
                        </div>
                        <button 
                            onClick={openPremiumModal}
                            className="w-full sm:w-auto px-4 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold cursor-pointer whitespace-nowrap hover:bg-amber-500/20 transition-colors"
                        >
                            LEARN MORE
                        </button>
                    </div>
                )}

                <SummaryStats
                    currentValue={summaryData?.currentValue ?? 0}
                    totalInvestment={summaryData?.totalInvestment ?? 0}
                    profitAfterSell={summaryData?.profitAfterSell ?? 0}
                    totalReturns={summaryData?.totalReturns ?? 0}
                    profitPercentage={summaryData?.profitPercentage ?? 0}
                    isLoading={isSummaryLoading}
                />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">

                    <div className="flex flex-col gap-3 order-2 lg:order-1">
                        <HoldingsFilters 
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            search={search}
                            setSearch={setSearch}
                            status={status}
                            setStatus={setStatus}
                            setPage={setPage}
                        />

                        <div className="overflow-x-auto">
                            {activeTab === 'history' ? (
                                <TradeHistoryTable
                                    data={(historyData?.data as unknown as React.ComponentProps<typeof TradeHistoryTable>['data']) || []}
                                    total={historyData?.total || 0}
                                    page={page}
                                    limit={limit}
                                    onPageChange={handlePageChange}
                                    isLoading={isHistoryLoading}
                                />
                            ) : activeTab === 'pending' ? (
                                <PendingOrdersTable />
                            ) : (
                                <HoldingsTable
                                    items={investments}
                                    total={totalCount}
                                    page={page}
                                    limit={limit}
                                    onPageChange={handlePageChange}
                                    activeTab={activeTab}
                                    returnType={returnType}
                                    isLoading={isAssetsLoading}
                                    isError={isError}
                                    error={_error}
                                    search={search}
                                    onNavigate={(symbol) => navigate({ to: `/user/stocks/${symbol}` })}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 order-1 lg:order-2">
                        <PortfolioXirrCard xirrValue={xirrValue} />
                        
                        <AssetAllocationDonut allocations={summaryData?.allocations} />

                        <PortfolioProjection />


                        <button
                            onClick={() => {
                                if (!user?.isVerified) {
                                    toast.error("Complete your KYC to enable redemption features");
                                    return;
                                }
                                navigate({ to: ROUTES.USER.PORTFOLIO.REDEEM_PROFIT });
                            }}
                            className={`w-full py-2.5 rounded-md flex items-center justify-center gap-2 text-xs font-bold transition-all duration-150 tracking-wide ${!user?.isVerified ? 'bg-gray-500/5 border border-gray-500/20 text-gray-500 cursor-not-allowed opacity-60 grayscale' : 'bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 cursor-pointer'}`}
                        >
                            <TrendingUp size={14} />
                            Redeem Profit
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PortfolioDashboard;
