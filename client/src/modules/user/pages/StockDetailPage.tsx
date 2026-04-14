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
import PremiumPaymentModal from '@/shared/components/modals/premium-payment/PremiumPaymentModal'
import type { TradeData } from '@shared/components/modals/TradeModal'
import { useTradeMutation } from '@shared/hooks/useTradeMutation'
import { getPortfolioInvestments } from '@shared/services/feature/portfolio/PortfolioApi'
import {
  getAlgoStrategies,
  saveAlgoStrategy,
  getActiveStrategyBySymbol,
  toggleAlgoStrategyStatus
} from '@shared/services/feature/algo-trading/AlgoTradingApi'

const StockDetailPage = () => {
  const { symbol } = useParams({ strict: false }) as { symbol: string }

  const [realtimePrice, setRealtimePrice] = useState<number | null>(null)
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)

  const [algoStep, setAlgoStep] = useState<'idle' | 'selecting' | 'active'>('idle')
  const [selectedStrategy, setSelectedStrategy] = useState('')

  const { data: strategies = [], isLoading: isLoadingStrategies } = useQuery({
    queryKey: ['algoStrategies'],
    queryFn: getAlgoStrategies
  })

  const saveAlgoMutation = useMutation({
    mutationFn: saveAlgoStrategy,
    onSuccess: () => {
      setAlgoStep('active')
      toast.success("Algo trading started successfully.")
    },
    onError: () => toast.error("Failed to start algo trading.")
  })

  const handleAlgoStart = () => {
    const strategy = strategies.find(s => s.name === selectedStrategy)
    const config: Record<string, any> = {}

    strategy?.configSchema.forEach(f => {
      config[f.key] = f.default
    })

    saveAlgoMutation.mutate({
      symbol,
      strategyName: selectedStrategy,
      config
    })
  }

  const { data: activeStrategy, refetch } = useQuery({
    queryKey: ['activeAlgoStrategy', symbol],
    queryFn: () => getActiveStrategyBySymbol(symbol),
    enabled: !!symbol
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ strategyId, isActive }: any) =>
      toggleAlgoStrategyStatus(strategyId, isActive),
    onSuccess: () => {
      refetch()
      setAlgoStep('idle')
      toast.info("Algo stopped")
    }
  })

  const handleAlgoStop = () => {
    if (activeStrategy?._id) {
      toggleStatusMutation.mutate({
        strategyId: activeStrategy._id,
        isActive: false
      })
    }
  }

  useEffect(() => {
    if (activeStrategy) {
      setAlgoStep('active')
      setSelectedStrategy(activeStrategy.strategyName)
    }
  }, [activeStrategy])

  useEffect(() => {
    if (strategies.length && !selectedStrategy) {
      setSelectedStrategy(strategies[0].name)
    }
  }, [strategies])

  const { data: queryData } = useQuery({
    queryKey: ['stockDetails', symbol],
    queryFn: () => finnhubService.getStockDetails(symbol),
    enabled: !!symbol,
    refetchInterval: 3000
  })

  const responseData = queryData?.data
  const stockInfo = responseData?.data
  const currentPrice = realtimePrice ?? responseData?.latestPrice

  const { buy, sell, isTrading } = useTradeMutation()

  const handleTradeClick = (type: 'buy' | 'sell') => {
    const { user } = useUserStore.getState()

    if (!user?.isSubscribed) {
      toast.warning("Upgrade to Premium")
      setIsPremiumModalOpen(true)
      return
    }

    setTradeType(type)
    setIsTradeModalOpen(true)
  }


  return (
    <div className="min-h-screen bg-[#0b0c0e] text-white">

      {/* Algo Console */}
      <div className="bg-[#111214] border p-5 rounded-lg">

        {algoStep === 'idle' && (
          <button
            onClick={() => {
              const { user } = useUserStore.getState()
              if (!user?.isSubscribed) {
                toast.warning("Upgrade to Premium")
                setIsPremiumModalOpen(true)
              } else {
                setAlgoStep('selecting')
              }
            }}
            className="w-full py-2 bg-gray-800 rounded"
          >
            Setup Algo Trading
          </button>
        )}

        {algoStep === 'selecting' && (
          <div>
            <select
              value={selectedStrategy}
              onChange={e => setSelectedStrategy(e.target.value)}
            >
              {strategies.map(s => (
                <option key={s.name} value={s.name}>
                  {s.displayName}
                </option>
              ))}
            </select>

            <button onClick={handleAlgoStart}>
              Start
            </button>
          </div>
        )}

        {algoStep === 'active' && (
          <div>
            <p>Running: {selectedStrategy}</p>
            <button onClick={handleAlgoStop}>Stop</button>
          </div>
        )}
      </div>

      {/* Trade Buttons */}
      <div className="p-4 space-y-2">
        <button onClick={() => handleTradeClick('buy')}>Buy</button>
        <button onClick={() => handleTradeClick('sell')}>Sell</button>
      </div>

      {/* Modals */}
      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        symbol={symbol}
        name={stockInfo?.name || symbol}
        currentPrice={currentPrice ?? 0}
        initialType={tradeType}
        isLoading={isTrading}
        onConfirm={() => {}}
      />

      <PremiumPaymentModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  )
}

export default StockDetailPage