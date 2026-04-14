import { useParams, Link } from '@tanstack/react-router'
import { ArrowLeft, Bot, ChevronRight, Zap } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useUserStore } from '@stores/user/UserStore'
import { finnhubService } from '@shared/services/finnhub.service'
import stockCurrencyService from '@shared/services/stockCurrency.service'
import { StockChart } from '@modules/user/components/StockChart'
import { socketService } from '@shared/services/socket'
import TradeModal from '@shared/components/modals/TradeModal'
import PremiumPaymentModal from '@shared/components/modals/PremiumPaymentModal'
import type { TradeData } from '@shared/components/modals/TradeModal'
import { useTradeMutation } from '@shared/hooks/useTradeMutation'
import { getPortfolioInvestments } from '@shared/services/feature/portfolio/PortfolioApi';
import { getAlgoStrategies, saveAlgoStrategy, getActiveStrategyBySymbol, toggleAlgoStrategyStatus } from '@shared/services/feature/algo-trading/AlgoTradingApi';

const StockDetailPage = () => {
  const { symbol } = useParams({ strict: false }) as { symbol: string }
  const [realtimePrice, setRealtimePrice] = useState<number | null>(null);

  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const [algoStep, setAlgoStep] = useState<'idle' | 'selecting' | 'active'>('idle');
  const [selectedStrategy, setSelectedStrategy] = useState('');

  const { data: strategies = [], isLoading: isLoadingStrategies } = useQuery({
    queryKey: ['algoStrategies'],
    queryFn: getAlgoStrategies,
  });

  const saveAlgoMutation = useMutation({
    mutationFn: saveAlgoStrategy,
    onSuccess: () => {
      setAlgoStep('active');
      toast.success("Algo trading started successfully.");
    },
    onError: (error) => {
      console.error("Failed to save algo strategy:", error);
      toast.error("Failed to start algo trading. Please try again.");
    }
  });

  const handleAlgoStart = async () => {
    if (!selectedStrategy || !symbol) return;

    const strategy = strategies.find(s => s.name === selectedStrategy);
    const config: Record<string, any> = {};
    strategy?.configSchema.forEach(field => {
      config[field.key] = field.default;
    });

    saveAlgoMutation.mutate({
      symbol,
      strategyName: selectedStrategy,
      config
    });
  };

  const { data: activeStrategy, refetch: refetchActiveStrategy } = useQuery({
    queryKey: ['activeAlgoStrategy', symbol],
    queryFn: () => getActiveStrategyBySymbol(symbol),
    enabled: !!symbol,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ strategyId, isActive }: { strategyId: string, isActive: boolean }) =>
      toggleAlgoStrategyStatus(strategyId, isActive),
    onSuccess: () => {
      refetchActiveStrategy();
      setAlgoStep('idle');
      toast.info("Algo strategy stopped.");
    },
    onError: (error) => {
      console.error("Failed to toggle strategy status:", error);
      toast.error("An error occurred while stopping the strategy.");
    }
  });

  const handleAlgoStop = () => {
    if (activeStrategy?._id) {
      toggleStatusMutation.mutate({ strategyId: activeStrategy._id, isActive: false });
    } else {
      setAlgoStep('idle');
    }
  };

  useEffect(() => {
    if (activeStrategy) {
      setAlgoStep('active');
      setSelectedStrategy(activeStrategy.strategyName);
    }
  }, [activeStrategy]);

  useEffect(() => {
    if (strategies.length > 0 && !selectedStrategy) {
      setSelectedStrategy(strategies[0].name);
    }
  }, [strategies, selectedStrategy]);

  const { data: queryData, isLoading, isError } = useQuery({
    queryKey: ['stockDetails', symbol],
    queryFn: () => finnhubService.getStockDetails(symbol),
    refetchInterval: 3000,
    enabled: !!symbol,
  });

  const { data: holdingsData } = useQuery({
    queryKey: ['portfolio', symbol],
    queryFn: () => getPortfolioInvestments(1, 10, undefined, symbol),
    enabled: !!symbol,
  });

  const position = holdingsData?.data?.find(inv =>
    (inv.schemeCode === symbol || (inv as any).symbol === symbol) &&
    (inv.investmentType?.toLowerCase() === 'stock' || inv.category?.toLowerCase() === 'stock' || !inv.investmentType)
  );

  useEffect(() => {
    if (!symbol) return;

    const handleUpdate = (trade: { symbol: string, price: number }) => {
      if (trade.symbol === symbol) {
        setRealtimePrice(trade.price);
      }
    };

    socketService.on('stock_update', handleUpdate);
    return () => socketService.off('stock_update', handleUpdate);
  }, [symbol]);

  const responseData = queryData?.data;
  const stockInfo = responseData?.data;
  const apiPrice = responseData?.latestPrice;
  const currentPrice = realtimePrice ?? apiPrice;
  const change = responseData?.change ?? 0;
  const changePercent = responseData?.changePercent ?? 0;
  const isPositive = change >= 0;

  const fmt = (v: any, digits = 2) => {
    if (v === undefined || v === null || isNaN(Number(v))) return '0.00';
    return Number(v).toLocaleString('en-IN', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  const { buy, sell, isTrading } = useTradeMutation();

  const handleTradeClick = (type: 'buy' | 'sell') => {
    setTradeType(type);
    setIsTradeModalOpen(true);
  };

  const handleTradeConfirm = async (tradeData: TradeData) => {
    try {
      if (tradeData.type === 'buy') {
        await buy({
          symbol: tradeData.symbol,
          quantity: tradeData.quantity,
          orderType: tradeData.orderType as any,
          price: tradeData.price,
          stopLoss: tradeData.stopLoss,
          takeProfit: tradeData.takeProfit,
        });
      } else {
        await sell({
          symbol: tradeData.symbol,
          quantity: tradeData.quantity,
          orderType: tradeData.orderType as any,
          price: tradeData.price,
          stopLoss: tradeData.stopLoss,
          takeProfit: tradeData.takeProfit,
        });
      }
      setIsTradeModalOpen(false);
    } catch (error) {
      console.error("Trade execution failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] flex items-center justify-center font-sans tracking-tight">
        <p className="text-[#5a5f6e] text-xs uppercase tracking-widest animate-pulse">Syncing market data...</p>
      </div>
    );
  }

  if (isError || !stockInfo) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] flex items-center justify-center font-sans tracking-tight">
        <p className="text-[#FF1744] text-xs uppercase tracking-widest">Error loading data for {symbol}.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] font-sans selection:bg-[#2962ff]/30">
      {/* Top Navigation Bar */}
      <div className="border-b border-[#1e2025] bg-[#0b0c0e] sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/user/trading" className="text-[#5a5f6e] hover:text-[#e8eaed] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-6 w-[1px] bg-[#1e2025] mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-[#111214] border border-[#1e2025] flex items-center justify-center overflow-hidden shrink-0">
                {stockInfo.logo ? (
                  <img src={stockInfo.logo} alt="" className="w-5 h-5 object-contain" />
                ) : (
                  <span className="text-[10px] font-bold text-[#5a5f6e]">{(stockInfo.symbol || symbol).slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-[#e8eaed]">{stockInfo.symbol || symbol}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1e2025] text-[#5a5f6e] font-bold uppercase tracking-wider">{stockInfo.exchange || 'NSE'}</span>
                </div>
                <span className="text-[10px] text-[#5a5f6e] font-medium leading-none">{stockInfo.name || symbol}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm font-bold tracking-tight">
                {stockCurrencyService.formatCurrency(currentPrice, 'INR')}
              </div>
              <div className={`text-[10px] font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-[#00C853]' : 'text-[#FF1744]'}`}>
                <span>{isPositive ? '+' : ''}{fmt(change)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleTradeClick('buy')}
                className="px-5 py-1.5 bg-[#00C853] text-[#0b0c0e] text-[11px] font-bold rounded hover:bg-[#00e676] transition-all active:scale-95 uppercase tracking-wider"
              >
                Buy
              </button>
              <button
                onClick={() => handleTradeClick('sell')}
                className="px-5 py-1.5 bg-[#FF1744] text-[#e8eaed] text-[11px] font-bold rounded hover:bg-[#ff5252] transition-all active:scale-95 uppercase tracking-wider"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Chart Area */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Chart Container */}
            <div className="bg-[#111214] border border-[#1e2025] rounded-lg overflow-hidden flex flex-col h-[650px]">
              <StockChart symbol={symbol} position={position} />
            </div>

            {/* Detailed Market Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MarketStatCard label="Open" value={`₹${fmt(responseData?.open)}`} />
              <MarketStatCard label="High" value={`₹${fmt(responseData?.high)}`} />
              <MarketStatCard label="Low" value={`₹${fmt(responseData?.low)}`} />
              <MarketStatCard label="Prev Close" value={`₹${fmt(responseData?.previousClose)}`} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Algo Console */}
            <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5 flex flex-col relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 ${algoStep === 'active' ? 'bg-[#00C853]' : 'bg-[#2962ff]'}`}></div>

              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#5a5f6e]" />
                  <span className="text-[11px] font-bold text-[#5a5f6e] uppercase tracking-[0.08em]">Algo Console</span>
                </div>
                {algoStep === 'active' && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00C853]/10 border border-[#00C853]/20">
                    <span className="w-1 h-1 rounded-full bg-[#00C853] animate-pulse"></span>
                    <span className="text-[9px] font-bold text-[#00C853] uppercase tracking-tighter">Live</span>
                  </div>
                )}
              </div>

              <div className="relative z-10 space-y-5">
                {algoStep === 'idle' && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-[#5a5f6e] leading-relaxed">Deploy automated strategies for {symbol}. Our engine scans live data to execute trades based on your selected parameters.</p>
                    <button
                      onClick={() => {
                        const { user } = useUserStore.getState();
                        if (!user?.isSubscribed) {
                          toast.warning("Upgrade to Premium to unlock algorithmic trading.");
                          setIsPremiumModalOpen(true);
                        } else {
                          setAlgoStep('selecting');
                        }
                      }}
                      className="w-full py-2 bg-[#1e2025] hover:bg-[#272b33] text-[#e8eaed] text-[11px] font-bold rounded transition-colors uppercase tracking-widest border border-[#272b33] flex items-center justify-center gap-2 group"
                    >
                      Setup Algo
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}

                {algoStep === 'selecting' && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <select
                          value={selectedStrategy}
                          onChange={(e) => setSelectedStrategy(e.target.value)}
                          className="w-full bg-[#0b0c0e] border border-[#1e2025] rounded px-3 py-2 text-[11px] text-[#e8eaed] focus:outline-none focus:border-[#00C853]/50 appearance-none cursor-pointer font-bold uppercase tracking-tight"
                        >
                          {isLoadingStrategies ? (
                            <option>Loading...</option>
                          ) : strategies.map(s => (
                            <option key={s.name} value={s.name}>{s.displayName}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#5a5f6e] rotate-90 pointer-events-none" />
                      </div>
                      <div className="p-3 bg-[#0b0c0e] border border-[#1e2025] rounded">
                        <p className="text-[10px] text-[#5a5f6e] leading-relaxed italic">
                          {strategies.find(s => s.name === selectedStrategy)?.displayName || 'Select a strategy'} - Ready to monitor ticks.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setAlgoStep('idle')} className="flex-1 py-2 text-[11px] font-bold text-[#5a5f6e] hover:text-[#e8eaed] transition-colors">Cancel</button>
                      <button
                        onClick={handleAlgoStart}
                        disabled={saveAlgoMutation.isPending}
                        className="flex-[2] py-2 bg-[#00C853] text-[#0b0c0e] text-[11px] font-bold rounded hover:bg-[#00e676] active:scale-[0.98] transition-all uppercase tracking-wider"
                      >
                        {saveAlgoMutation.isPending ? 'Starting...' : 'Confirm'}
                      </button>
                    </div>
                  </div>
                )}

                {algoStep === 'active' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0b0c0e] border border-[#00C853]/20 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-[#00C853]" />
                        <span className="text-[11px] font-bold text-[#e8eaed] uppercase tracking-wide">{strategies.find(s => s.name === selectedStrategy)?.displayName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] text-[#5a5f6e] uppercase tracking-widest font-bold">Status</span>
                          <p className="text-[10px] font-bold text-[#00C853]">RUNNING</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <span className="text-[9px] text-[#5a5f6e] uppercase tracking-widest font-bold">Runtime</span>
                          <p className="text-[10px] font-bold text-[#e8eaed]">Direct Hook</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleAlgoStop}
                      disabled={toggleStatusMutation.isPending}
                      className="w-full py-2 bg-[#FF1744]/10 text-[#FF1744] border border-[#FF1744]/20 hover:bg-[#FF1744]/20 text-[11px] font-bold rounded transition-colors uppercase tracking-widest"
                    >
                      {toggleStatusMutation.isPending ? 'Stopping...' : 'Terminate Strategy'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Asset Performance Summary */}
            <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5 space-y-4">
              <p className="text-[11px] font-bold text-[#5a5f6e] uppercase tracking-widest">Market Depth</p>
              <div className="space-y-3">
                <StatRow label="Avg Volume" value={fmt(responseData?.volume / 1000000, 2) + 'M'} />
                <StatRow label="Previous Close" value={`₹${fmt(responseData?.previousClose)}`} />
                <StatRow label="Session High" value={`₹${fmt(responseData?.high)}`} />
                <StatRow label="Session Low" value={`₹${fmt(responseData?.low)}`} />
              </div>
            </div>

            {/* Sector/Exch Info */}
            <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-widest">Sector</span>
                  <span className="text-[10px] font-bold text-[#e8eaed]">{stockInfo.sector || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-widest">Tradable</span>
                  <span className={`text-[10px] font-bold ${stockInfo.isTradable ? 'text-[#00C853]' : 'text-[#FF1744]'}`}>
                    {stockInfo.isTradable ? 'YES' : 'STRICTED'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        symbol={symbol}
        name={stockInfo.name || symbol}
        currentPrice={currentPrice ?? 0}
        initialType={tradeType}
        isLoading={isTrading}
        onConfirm={handleTradeConfirm}
      />

      <PremiumPaymentModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  );
};

const MarketStatCard = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
    <p className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className="text-lg font-bold text-[#e8eaed] tracking-tight">{value}</p>
  </div>
);

const StatRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center border-b border-[#1e2025] pb-2 last:border-0 last:pb-0">
    <span className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-tight">{label}</span>
    <span className="text-[11px] font-bold text-[#e8eaed]">{value}</span>
  </div>
);

export default StockDetailPage;
