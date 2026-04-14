import { useParams, Link } from '@tanstack/react-router'
import { TrendingUp, TrendingDown, ArrowLeft, Bot, Cpu, ChevronRight, Zap } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { finnhubService } from '@shared/services/finnhub.service'
import stockCurrencyService from '@shared/services/stockCurrency.service'
import { StockChart } from '@modules/user/components/StockChart'
import { socketService } from '@shared/services/socket'
import TradeModal from '@shared/components/modals/TradeModal'
import type { TradeData } from '@shared/components/modals/TradeModal'
import { useTradeMutation } from '@shared/hooks/useTradeMutation'
import { getPortfolioInvestments } from '@shared/services/feature/portfolio/PortfolioApi';
import { getAlgoStrategies, saveAlgoStrategy, getActiveStrategyBySymbol, toggleAlgoStrategyStatus } from '@shared/services/feature/algo-trading/AlgoTradingApi';
import { useUserStore } from '@stores/user/UserStore';
import PremiumPaymentModal from '@/shared/components/modals/premium-payment/PremiumPaymentModal';
import { toast } from 'sonner';

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
    },
    onError: (error) => {
      console.error("Failed to save algo strategy:", error);
      alert("Failed to start algo trading. Please try again.");
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
    onSuccess: (response: any) => {
      if (response.data?.upgrade) {
        toast.warning(response.data.message || "Upgrade to Premium to unlock advanced algorithmic trading features.");
        setIsPremiumModalOpen(true);
        return;
      }
      refetchActiveStrategy();
      setAlgoStep('idle');
    },
    onError: (error) => {
      console.error("Failed to toggle strategy status:", error);
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

  const isPositive = true;

  const { buy, sell, isTrading } = useTradeMutation();

  const handleTradeClick = (type: 'buy' | 'sell') => {
    console.log(`[DetailPage] Opening Trade Modal for: ${symbol} as ${type}`);
    setTradeType(type);
    setIsTradeModalOpen(true);
  };

  const handleTradeConfirm = async (tradeData: TradeData) => {
    try {
      if (tradeData.type === 'buy') {
        const response = await buy({
          symbol: tradeData.symbol,
          quantity: tradeData.quantity,
          orderType: tradeData.orderType as any,
          price: tradeData.price,
          stopLoss: tradeData.stopLoss,
          takeProfit: tradeData.takeProfit,
        });

        if (response.data?.upgrade) {
          toast.warning(response.data.message || "Upgrade to Premium to unlock stock trading features.");
          setIsPremiumModalOpen(true);
          setIsTradeModalOpen(false);
          return;
        }
      } else {
        const response = await sell({
          symbol: tradeData.symbol,
          quantity: tradeData.quantity,
          orderType: tradeData.orderType as any,
          price: tradeData.price,
          stopLoss: tradeData.stopLoss,
          takeProfit: tradeData.takeProfit,
        });

        if (response.data?.upgrade) {
          toast.warning(response.data.message || "Upgrade to Premium to unlock stock trading features.");
          setIsPremiumModalOpen(true);
          setIsTradeModalOpen(false);
          return;
        }
      }
      setIsTradeModalOpen(false);
    } catch (error) {
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-inter pb-10">
        <p className="text-gray-400">Loading realtime stock data...</p>
      </div>
    );
  }

  if (isError || !stockInfo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-inter pb-10">
        <p className="text-red-400">Error loading data for {symbol}.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter pb-10 p-6">
      <div className="mb-6">
        <Link
          to="/user/trading"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trading
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center font-bold text-lg overflow-hidden">
            {stockInfo.logo ? (
              <img src={stockInfo.logo} alt={stockInfo.symbol} className="object-cover w-full h-full" />
            ) : (
              (stockInfo.symbol || symbol).charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{stockInfo.name || symbol}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{stockInfo.exchange || 'NSE'} · {stockInfo.sector || 'Equity'}</p>
          </div>
        </div>

        {/* Algo Trading Top Status Indicator */}
        {algoStep === 'active' && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
            <span className="text-[10px] font-bold text-[#22C55E] tracking-widest uppercase">Algo Active: {strategies.find(s => s.name === selectedStrategy)?.displayName}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="flex items-end justify-between bg-[#0f0f0f] p-6 rounded-xl border border-[#1f1f1f]">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Current Price</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold tracking-tight text-white">
                  {stockCurrencyService.formatCurrency(currentPrice, 'INR')}
                </p>
                <div className={`flex items-center gap-1 text-sm font-semibold ml-2 ${isPositive ? 'text-[#22C55E]' : 'text-red-500'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>—% today</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-[550px] bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-1 flex flex-col">
            <StockChart symbol={symbol} position={position} />
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Algo Console Section */}
          <div className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-6 relative overflow-hidden group">
            {/* Background Glow Effect */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] rounded-full transition-all duration-700 ${algoStep === 'active' ? 'bg-[#22C55E]/20' : algoStep === 'selecting' ? 'bg-blue-500/10' : 'bg-gray-800/10'}`}></div>

            <div className="flex items-center justify-between gap-2 mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${algoStep === 'active' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-white/5 text-gray-400'}`}>
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-100 tracking-tight">Algo Console</h3>
              </div>
              {algoStep === 'active' && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#22C55E]/10 border border-[#22C55E]/30">
                  <span className="w-1 h-1 rounded-full bg-[#22C55E] animate-ping"></span>
                  <span className="text-[8px] font-bold text-[#22C55E] tracking-tighter uppercase">LIVE</span>
                </div>
              )}
            </div>

            <div className="space-y-6 relative z-10">
              {/* State Machine UI */}
              {algoStep === 'idle' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <p className="text-xs font-semibold text-gray-100">AI-Powered Trading</p>
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Automate your execution strategy for {symbol} using advanced algorithms.</p>
                  </div>
                  <button
                    onClick={() => {
                      const { user } = useUserStore.getState();
                      if (!user?.isSubscribed) {
                        toast.warning("Upgrade to Premium to unlock advanced algorithmic trading features.");
                        setIsPremiumModalOpen(true);
                      } else {
                        setAlgoStep('selecting');
                      }
                    }}
                    className="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Setup Algo Trading
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {algoStep === 'selecting' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest">Choose Strategy</p>
                      <button onClick={() => setAlgoStep('idle')} className="text-[10px] text-gray-500 hover:text-white transition-colors">Cancel</button>
                    </div>

                    <div className="relative">
                      <select
                        value={selectedStrategy}
                        onChange={(e) => setSelectedStrategy(e.target.value)}
                        className="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/20 transition-all appearance-none cursor-pointer"
                        disabled={isLoadingStrategies}
                      >
                        {isLoadingStrategies ? (
                          <option value="" disabled>Loading strategies...</option>
                        ) : strategies.length > 0 ? (
                          strategies.map(strategy => (
                            <option key={strategy.name} value={strategy.name} className="bg-[#0f0f0f]">
                              {strategy.displayName}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No strategies available</option>
                        )}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronRight className="w-3.5 h-3.5 text-gray-500 rotate-90" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 backdrop-blur-sm">
                      <p className="text-[10px] text-gray-300 leading-relaxed italic">
                        "{strategies.find(s => s.name === selectedStrategy)?.displayName || 'Select a strategy...'} - Configure algorithmic parameters upon execution."
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleAlgoStart}
                    disabled={saveAlgoMutation.isPending}
                    className="w-full py-3 rounded-lg bg-[#22C55E] text-black text-xs font-bold hover:bg-[#16a34a] transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saveAlgoMutation.isPending ? 'Starting Engine...' : 'Confirm & Start Trading'}
                  </button>
                </div>
              )}

              {algoStep === 'active' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="p-4 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-4 h-4 text-[#22C55E] fill-[#22C55E]/20" />
                      <p className="text-xs font-bold text-white uppercase tracking-tight">Strategy: {strategies.find(s => s.name === selectedStrategy)?.displayName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 rounded p-2 border border-white/5">
                        <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Status</p>
                        <p className="text-[10px] text-white font-medium">Scanning Markets</p>
                      </div>
                      <div className="bg-black/40 rounded p-2 border border-white/5">
                        <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Signal Mode</p>
                        <p className="text-[10px] text-white font-medium">Live Tick</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAlgoStop}
                    disabled={toggleStatusMutation.isPending}
                    className="w-full py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Zap className={`w-3.5 h-3.5 rotate-180 ${toggleStatusMutation.isPending ? 'animate-pulse' : ''}`} />
                    {toggleStatusMutation.isPending ? 'Stopping...' : 'Stop Algo Trading'}
                  </button>
                </div>
              )}

              {/* Engine Bar */}
              <div className="pt-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded bg-black/40 border border-[#1f1f1f]">
                  <Cpu className={`w-3 h-3 ${algoStep === 'active' ? 'text-[#22C55E]' : 'text-gray-600'}`} />
                  <span className="text-[10px] text-gray-400 font-medium tracking-tight">Execution Engine: <span className={algoStep === 'active' ? 'text-white' : 'text-gray-600'}>v1.0.4 r2</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-6 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Trade {symbol}</h3>
            <button
              onClick={() => {
                const { user } = useUserStore.getState();
                if (!user?.isSubscribed) {
                  toast.warning("Upgrade to Premium to unlock stock trading features.");
                  setIsPremiumModalOpen(true);
                } else {
                  handleTradeClick('buy');
                }
              }}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all shadow-[0_4px_14px_rgba(34,197,94,0.15)] ${stockInfo.isTradable ? 'bg-[#22C55E] text-black hover:bg-[#16a34a] hover:-translate-y-0.5' : 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              disabled={!stockInfo.isTradable}
            >
              Buy
            </button>
            <button
              onClick={() => {
                const { user } = useUserStore.getState();
                if (!user?.isSubscribed) {
                  toast.warning("Upgrade to Premium to unlock stock trading features.");
                  setIsPremiumModalOpen(true);
                } else {
                  handleTradeClick('sell');
                }
              }}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${stockInfo.isTradable ? 'bg-[#0f0f0f] border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:-translate-y-0.5' : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!stockInfo.isTradable}
            >
              Sell
            </button>
            {!stockInfo.isTradable && (
              <p className="text-xs text-red-500 text-center mt-2">Trading halted for this symbol.</p>
            )}
          </div>

          <div className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-6 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Market Stats</h3>
            {[
              { label: 'Open', value: '—' },
              { label: 'Prev. Close', value: '—' },
              { label: '52W High', value: '—' },
              { label: '52W Low', value: '—' },
              { label: 'Volume', value: '—' },
            ].map(stat => (
              <div key={stat.label} className="flex justify-between items-center border-b border-[#1f1f1f] pb-3 last:border-0 last:pb-0">
                <span className="text-xs text-gray-400">{stat.label}</span>
                <span className="text-sm font-medium text-white">{stat.value}</span>
              </div>
            ))}
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
  )
}

export default StockDetailPage

