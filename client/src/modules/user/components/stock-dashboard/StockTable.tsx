import React from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import Sparkline from './Sparkline';
import stockCurrencyService from '@shared/services/stockCurrency.service';
import type { StockTableProps } from '../../types/stock-dashboard.types';

const StockTable: React.FC<StockTableProps> = ({
  stocks,
  isLoading,
  isError,
  watchlistSymbols,
  onToggleWatchlist,
  onNavigate
}) => {
  if (isLoading) {
    return (
      <div className="px-5 py-4 text-center">
        <div className="animate-pulse flex flex-col space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-[#1a1c20] rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-[#FF1744] text-sm">
        Failed to load market data.
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="text-center py-10 text-[#5a5f6e] text-sm">
        No stocks found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#1e2025] text-[#5a5f6e] uppercase tracking-widest bg-[#0b0c0e]">
            <th style={{ fontSize: 10, fontWeight: 600, padding: '8px 20px', letterSpacing: '0.06em' }}>Asset</th>
            <th style={{ fontSize: 10, fontWeight: 600, padding: '8px 20px', letterSpacing: '0.06em', textAlign: 'right' }}>Price</th>
            <th style={{ fontSize: 10, fontWeight: 600, padding: '8px 20px', letterSpacing: '0.06em', textAlign: 'right' }}>24h Change</th>
            <th style={{ fontSize: 10, fontWeight: 600, padding: '8px 20px', letterSpacing: '0.06em', textAlign: 'center' }}>Trend (7d)</th>
            <th style={{ fontSize: 10, fontWeight: 600, padding: '8px 20px', letterSpacing: '0.06em', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e2025]">
          {stocks.map((stock) => {
            const price = stock.price ?? 0;
            const changePercent = stock.changePercent ?? 0;
            const change = stock.change ?? 0;
            const isPositive = changePercent >= 0;
            const isWatched = watchlistSymbols.has(stock.symbol);
            const history = stock.history && stock.history.length > 0 
              ? stock.history 
              : Array.from({ length: 6 }, () => price); // Fallback


            return (
              <tr key={stock.symbol} className="hover:bg-[#15171a] transition-colors group">
                <td className="px-5 py-3.5 cursor-pointer" onClick={() => onNavigate(stock.symbol)}>
                  <div className="flex items-center gap-3">
                    {stock.logo ? (
                      <img src={stock.logo} alt={stock.symbol} className="w-7 h-7 rounded border border-[#1e2025] bg-white object-contain" />
                    ) : (
                      <div className="w-7 h-7 rounded bg-[#1a1c20] border border-[#1e2025] flex items-center justify-center font-bold text-[10px]">
                        {stock.symbol.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#e8eaed' }}>{stock.symbol}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(stock.symbol);
                          }}
                          className={`transition-colors ${isWatched ? 'text-yellow-500' : 'text-[#30363d] hover:text-[#5a5f6e]'}`}
                        >
                          <Star className={`w-3 h-3 ${isWatched ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div style={{ fontSize: 10, color: '#5a5f6e' }} className="max-w-[150px] truncate" title={stock.name}>{stock.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right cursor-pointer" onClick={() => onNavigate(stock.symbol)}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e8eaed' }}>{stockCurrencyService.formatCurrency(price, 'INR')}</div>
                </td>
                <td className="px-5 py-3.5 text-right cursor-pointer" onClick={() => onNavigate(stock.symbol)}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isPositive ? '#00C853' : '#FF1744' }} className="flex items-center justify-end gap-1">
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                  </div>
                  <div style={{ fontSize: 10, color: '#5a5f6e', marginTop: 1 }}>
                    {isPositive ? '+' : ''}₹{change.toFixed(2)}
                  </div>
                </td>
                <td className="px-5 py-3.5 cursor-pointer" onClick={() => onNavigate(stock.symbol)}>
                  <div className="flex justify-center">
                    <Sparkline data={history} positive={isPositive} />
                  </div>

                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(stock.symbol);
                    }}
                    className="px-4 py-1.5 rounded bg-[#1a1c20] hover:bg-[#2962ff] hover:border-[#2962ff] hover:text-white text-[#e8eaed] text-[11px] font-semibold transition-all border border-[#2a2d35]"
                  >
                    TRADE
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
