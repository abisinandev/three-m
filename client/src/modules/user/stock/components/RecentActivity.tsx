import React from 'react';
import { ListPlus } from 'lucide-react';
import stockCurrencyService from '@/shared/services/external/stock-currency.service';
import type { RecentActivityProps } from '../../types/stock-dashboard.types';

const RecentActivity: React.FC<RecentActivityProps> = ({ trades, onNavigate }) => {
  return (
    <div className="bg-[#111214] rounded-lg border border-[#1e2025] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontSize: 11, fontWeight: 600, color: '#5a5f6e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Recent Activity</h3>
        <button style={{ fontSize: 10, color: '#2962ff', fontWeight: 700 }}>HISTORY</button>
      </div>

      <div className="space-y-4">
        {trades.length === 0 ? (
          <div style={{ fontSize: 11, color: '#5a5f6e' }} className="py-4 text-center">No recent activity</div>
        ) : (
          trades.map((trade, i) => (
            <div 
              key={i} 
              onClick={() => onNavigate(trade.symbol)}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded bg-[#1a1c20] border border-[#1e2025] flex items-center justify-center flex-shrink-0 group-hover:border-[#2962ff]/50 transition-colors">
                <ListPlus size={14} className="text-[#5a5f6e] group-hover:text-[#2962ff]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e8eaed' }} className="truncate">{trade.symbol}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#00C853' }}>{trade.type}</span>
                </div>
                <div style={{ fontSize: 10, color: '#5a5f6e' }} className="flex items-center gap-2 mt-0.5">
                  <span>{trade.quantity} Qty</span>
                  <span>•</span>
                  <span>{stockCurrencyService.formatCurrency(trade.totalPrice, 'INR')}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;

