import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import stockCurrencyService from '@/shared/services/external/stock-currency.service';
import { FetchMarketMoversApi } from '@/shared/services/stock/fetch-stocks-api';
import type { MarketMoverProps } from '../../types/stock-dashboard.types';

const MarketMoverCard: React.FC<MarketMoverProps> = ({
  symbol,
  price,
  changePercent,
  onNavigate
}) => {
  const isPositive = changePercent >= 0;

  return (
    <div
      onClick={() => onNavigate(symbol)}
      className="p-3 bg-[#0b0c0e] border border-[#1e2025] rounded-lg hover:border-[#2962ff]/50 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: 11, fontWeight: 700, color: '#e8eaed' }}>{symbol}</span>
        <ChevronRight size={12} className="text-[#5a5f6e] group-hover:text-[#2962ff] transition-colors" />
      </div>
      <div className="flex items-end justify-between">
        <div style={{ fontSize: 12, fontWeight: 700, color: '#e8eaed' }}>
          {stockCurrencyService.formatCurrency(price, 'INR')}
        </div>
        <div
          style={{ fontSize: 10, fontWeight: 700, color: isPositive ? '#00C853' : '#FF1744' }}
          className="flex items-center gap-1"
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

const MarketMovers: React.FC<{ onNavigate: (symbol: string) => void }> = ({ onNavigate }) => {
  const { data: moversResponse, isLoading, isError } = useQuery({
    queryKey: ['market-movers'],
    queryFn: FetchMarketMoversApi,
    refetchInterval: 60000,
  });

  const movers = moversResponse?.data?.gainers ?? [];

  return (
    <div className="bg-[#111214] rounded-lg border border-[#1e2025] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#5a5f6e',
          letterSpacing: '0.06em',
          textTransform: 'uppercase'
        }}>
          Market Movers
        </h3>
        <button style={{ fontSize: 10, color: '#2962ff', fontWeight: 700 }}>VIEW ALL</button>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-[#0b0c0e] rounded-lg border border-[#1e2025]"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-4 text-[#FF1744] text-[10px]">
          Failed to load movers
        </div>
      ) : movers.length === 0 ? (
        <div className="text-center py-4 text-[#5a5f6e] text-[10px]">
          No active movers
        </div>
      ) : (
        <div className="space-y-3">
          {movers.map((mover) => (
            <MarketMoverCard
              key={mover.symbol}
              symbol={mover.symbol}
              price={mover.price ?? 0}
              changePercent={mover.changePercent ?? 0}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketMovers;

