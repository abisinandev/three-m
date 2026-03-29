import { useParams, Link } from '@tanstack/react-router'
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { finnhubService } from '@shared/services/finnhub.service'
import stockCurrencyService from '@shared/services/stockCurrency.service'
import { StockChart } from '@modules/user/components/StockChart'
import { socketService } from '@shared/services/socket'

const StockDetailPage = () => {
  const { symbol } = useParams({ strict: false }) as { symbol: string }
  const [realtimePrice, setRealtimePrice] = useState<number | null>(null);

  const { data: queryData, isLoading, isError } = useQuery({
    queryKey: ['stockDetails', symbol],
    queryFn: () => finnhubService.getStockDetails(symbol),
    refetchInterval: 3000,
    enabled: !!symbol,
  });

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

  const currentPriceINR = currentPrice != null 
    ? stockCurrencyService.convertUSDtoINR(currentPrice) 
    : null;

  const isPositive = true;

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
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          to="/user/trading"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trading
        </Link>
      </div>

      {/* Header */}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Price & Chart */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Price Header */}
          <div className="flex items-end justify-between bg-[#0f0f0f] p-6 rounded-xl border border-[#1f1f1f]">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Current Price</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold tracking-tight text-white">
                  {currentPriceINR != null ? stockCurrencyService.formatCurrency(currentPriceINR, 'INR') : '—'}
                </p>
                {currentPrice != null && (
                  <p className="text-sm text-gray-400 font-medium">
                    ({stockCurrencyService.formatCurrency(currentPrice, 'USD')})
                  </p>
                )}
                <div className={`flex items-center gap-1 text-sm font-semibold ml-2 ${isPositive ? 'text-[#22C55E]' : 'text-red-500'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>—% today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Wrapper */}
          <div className="w-full h-[550px] bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-1 flex flex-col">
            <StockChart symbol={symbol} />
          </div>
        </div>

        {/* RIGHT COLUMN: Order Entry & Stats */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Action Buttons */}
          <div className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-6 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Trade {symbol}</h3>
            <button
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all shadow-[0_4px_14px_rgba(34,197,94,0.15)] ${stockInfo.isTradable ? 'bg-[#22C55E] text-black hover:bg-[#16a34a] hover:-translate-y-0.5' : 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              disabled={!stockInfo.isTradable}
            >
              Buy
            </button>
            <button
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

          {/* Core Stats */}
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
    </div>
  )
}

export default StockDetailPage
