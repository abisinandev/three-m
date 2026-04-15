import React from 'react';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import stockCurrencyService from '@shared/services/stockCurrency.service';
import type { MarketMoverProps } from '../../types/stock-dashboard.types';

const MarketMoverCard: React.FC<MarketMoverProps> = ({
  symbol,
  price,
  change,
  changePercent,
  isPositive,
  onNavigate
}) => (
  <div
    onClick={() => onNavigate(symbol)}
    className="p-3 bg-[#0b0c0e] border border-[#1e2025] rounded-lg hover:border-[#2962ff]/50 transition-all cursor-pointer group"
  >
    <div className="flex items-center justify-between mb-2">
      <span style={{ fontSize: 11, fontWeight: 700, color: '#e8eaed' }}>{symbol}</span>
      <ChevronRight size={12} className="text-[#5a5f6e] group-hover:text-[#2962ff] transition-colors" />
    </div>
    <div className="flex items-end justify-between">
      <div style={{ fontSize: 12, fontWeight: 700, color: '#e8eaed' }}>{stockCurrencyService.formatCurrency(price, 'INR')}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: isPositive ? '#00C853' : '#FF1744' }} className="flex items-center gap-1">
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {isPositive ? '+' : ''}{changePercent}%
      </div>
    </div>
  </div>
);

const MarketMovers: React.FC<{ onNavigate: (symbol: string) => void }> = ({ onNavigate }) => {
  const movers = [
    { symbol: 'RELIANCE', price: 2942.15, change: 45.30, changePercent: 1.56, isPositive: true },
    { symbol: 'HDFCBANK', price: 1532.40, change: -12.15, changePercent: -0.79, isPositive: false },
    { symbol: 'INFY', price: 1422.60, change: 22.45, changePercent: 1.61, isPositive: true },
    { symbol: 'TCS', price: 3842.10, change: -5.20, changePercent: -0.14, isPositive: false },
  ];

  return (
    <div className="bg-[#111214] rounded-lg border border-[#1e2025] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontSize: 11, fontWeight: 600, color: '#5a5f6e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Market Movers</h3>
        <button style={{ fontSize: 10, color: '#2962ff', fontWeight: 700 }}>VIEW ALL</button>
      </div>
      <div className="space-y-3">
        {movers.map((mover, i) => (
          <MarketMoverCard
            key={i}
            {...mover}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketMovers;
