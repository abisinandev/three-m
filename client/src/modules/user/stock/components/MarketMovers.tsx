import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import stockCurrencyService from '@/shared/services/external/stock-currency.service';
import { FetchMarketMoversApi } from '@/shared/services/stock/fetch-stocks-api';
import type { MarketMoverProps } from '../types/stock-dashboard.types';

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
        <span className="text-sm font-bold text-[#e8eaed]">{symbol}</span>
        <ChevronRight size={12} className="text-[#5a5f6e] group-hover:text-[#2962ff] transition-colors" />
      </div>
      <div className="flex items-end justify-between">
        <div className="text-sm font-bold text-[#e8eaed] tabular-nums">
          {stockCurrencyService.formatCurrency(price, 'INR')}
        </div>
        <div
          className="text-xs font-bold flex items-center gap-1 tabular-nums"
          style={{ color: isPositive ? '#00C853' : '#FF1744' }}
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
        <h3 className="text-xs font-semibold text-[#5a5f6e] uppercase tracking-wider">
          Market Movers
        </h3>
        <button className="text-xs font-bold text-[#2962ff] tracking-wider">VIEW ALL</button>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-[#0b0c0e] rounded-lg border border-[#1e2025]"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-4 text-[#FF1744] text-xs">
          Failed to load movers
        </div>
      ) : movers.length === 0 ? (
        <div className="text-center py-4 text-[#5a5f6e] text-xs">
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

