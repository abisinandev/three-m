'use client';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useUserStore } from '@stores/user/UserStore';
import { ROUTES } from '@shared/constants/routes';
import { SummaryStats } from '../portfolio/components/SummaryStats';
import { HoldingsFilters } from '../portfolio/components/HoldingsFilters';
import { HoldingsTable } from '../portfolio/components/HoldingsTable';
import { TradeHistoryTable } from '../portfolio/components/TradeHistoryTable';
import { AssetAllocationDonut } from '../portfolio/components/AssetAllocationDonut';
import { PortfolioXirrCard } from '../portfolio/components/StatsSidebar';
import { usePremiumModalStore } from '@stores/user/PremiumModalStore';
import { usePortfolio } from '../portfolio/hooks/usePortfolio';
import PendingOrdersTable from '../components/stock-detail/PendingOrdersTable';
import { PortfolioProjection } from '../portfolio/components/PortfolioProjection';


const PortfolioDashboard = () => {
    const user = useUserStore((state) => state.user);
    const navigate = useNavigate();
    const { onOpen: openPremiumModal } = usePremiumModalStore();

    const {
        page, setPage, search, setSearch, status, setStatus,
        activeTab, setActiveTab, returnType, setReturnType, limit,
        summaryData, investments, totalCount, historyData,
        isLoading, isAssetsLoading, isHistoryLoading, isError, error, handlePageChange
    } = usePortfolio();

    const xirrValue = summaryData?.xirr ? Number(summaryData.xirr).toFixed(2) : '0.00';

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0b0c0e',
            color: '#e8eaed',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            paddingBottom: 48,
        }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', letterSpacing: '-0.2px', margin: 0 }}>
                            Portfolio
                        </h1>
                        <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0 }}>
                            Holdings & performance
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        background: '#111214',
                        border: '1px solid #1e2025',
                        borderRadius: 6,
                        padding: 2,
                        gap: 2,
                    }}>
                        {(['Absolute', 'XIRR'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setReturnType(t)}
                                style={{
                                    padding: '4px 10px',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: '0.05em',
                                    borderRadius: 4,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    background: returnType === t ? '#1e2025' : 'transparent',
                                    color: returnType === t ? '#e8eaed' : '#5a5f6e',
                                }}
                            >
                                {t.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {!user?.isSubscribed && (
                    <div style={{
                        background: 'rgba(245, 158, 11, 0.05)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: 8,
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ 
                                width: 28, height: 28, borderRadius: 6, 
                                background: 'rgba(245, 158, 11, 0.1)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center' 
                            }}>
                                <span style={{ color: '#f59e0b', fontSize: 10, fontWeight: 900, fontStyle: 'italic' }}>P</span>
                            </div>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: '#e8eaed', padding: 0, margin: 0 }}>Unlock Enhanced Intelligence</p>
                                <p style={{ fontSize: 10, color: '#5a5f6e', padding: 0, margin: 0 }}>Upgrade to Premium for advanced portfolio analytics, AI projections, and more.</p>
                            </div>
                        </div>
                        <button 
                            onClick={openPremiumModal}
                            style={{
                                padding: '6px 14px', borderRadius: 6,
                                background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)',
                                color: '#f59e0b', fontSize: 10, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'
                            }}
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
                    isLoading={isLoading}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <HoldingsFilters 
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            search={search}
                            setSearch={setSearch}
                            status={status}
                            setStatus={setStatus}
                            setPage={setPage}
                        />

                        {activeTab === 'history' ? (
                            <TradeHistoryTable 
                                data={historyData?.data || []}
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
                                error={error}
                                search={search}
                                onNavigate={(symbol) => navigate({ to: `/user/trading/${symbol}` })}
                            />
                        )}

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <PortfolioXirrCard xirrValue={xirrValue} />
                        
                        <AssetAllocationDonut investments={investments} />

                        <PortfolioProjection />


                        <button
                            onClick={() => navigate({ to: ROUTES.USER.PORTFOLIO.REDEEM_PROFIT })}
                            style={{
                                width: '100%', padding: '10px 0',
                                background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.25)',
                                borderRadius: 6, color: '#00C853', fontSize: 12, fontWeight: 700,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: 6, transition: 'all 0.15s', letterSpacing: '0.03em',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,200,83,0.18)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,200,83,0.1)'; }}
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
