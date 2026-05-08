import React, { useRef, useState, useEffect } from 'react';
import { useRealtimeChart } from '../hooks/useRealtimeChart';
import type { IInvestmentResponse } from '@shared/types/portfolio.types';

import { Eye, EyeOff } from 'lucide-react';

interface StockChartProps {
  symbol: string;
  position?: IInvestmentResponse;
}

const timeframes = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '30m', value: '30' },
  { label: '1H', value: '60' },
  { label: '1D', value: 'D' },
  { label: '1W', value: 'W' },
];

const isIndianMarketOpen = (): boolean => {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (3600000 * 5.5));
  
  const day = istDate.getDay();
  if (day === 0 || day === 6) return false;

  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const time = hours + (minutes / 60);

  // 9:15 AM = 9.25, 3:30 PM = 15.5
  return time >= 9.25 && time < 15.5;
};

const useChartTimer = (timeframe: string) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (timeframe === 'D' || timeframe === 'W') {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      if (!isIndianMarketOpen()) {
        setTimeLeft('Market Closed');
        return;
      }

      const now = Date.now();
      let bucketMs = 60000;
      switch (timeframe) {
        case '1': bucketMs = 1 * 60000; break;
        case '5': bucketMs = 5 * 60000; break;
        case '15': bucketMs = 15 * 60000; break;
        case '30': bucketMs = 30 * 60000; break;
        case '60': bucketMs = 60 * 60000; break;
        default: bucketMs = 60000; break;
      }

      // Calculate next candle boundary
      const nextBoundary = Math.ceil(now / bucketMs) * bucketMs;
      const diffMs = nextBoundary - now;

      if (diffMs <= 0) {
        setTimeLeft('00:00');
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;

      if (m >= 60) {
        const h = Math.floor(m / 60);
        const mRemaining = m % 60;
        setTimeLeft(`${h.toString().padStart(2, '0')}:${mRemaining.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeframe]);

  return timeLeft;
};

export const StockChart: React.FC<StockChartProps> = ({ symbol, position }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<string>('1');
  const [showPosition, setShowPosition] = useState<boolean>(true);

  const { isLoading, status, hasHistory } = useRealtimeChart(chartContainerRef, symbol, timeframe, position, showPosition);
  const timeLeft = useChartTimer(timeframe);

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#1f1f1f] bg-[#0a0a0a] rounded-t-xl shrink-0">
        <span className="text-xs text-gray-500 mr-2 uppercase tracking-wide font-medium">Timeframe</span>
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setTimeframe(tf.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${timeframe === tf.value
              ? 'bg-[#2962ff] text-white'
              : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
              }`}
          >
            {tf.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          {position && (
            <button 
              onClick={() => setShowPosition(!showPosition)} 
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-semibold transition-colors border ${showPosition ? 'bg-[#2962ff]/10 text-[#2962ff] border-[#2962ff]/20' : 'bg-transparent text-gray-500 border-transparent hover:text-gray-300'}`}
              title="Toggle Position Line"
            >
              {showPosition ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Position</span>
            </button>
          )}
          {timeLeft && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${timeLeft === 'Market Closed' ? 'bg-[#FF1744]/10 border border-[#FF1744]/20' : 'bg-[#1e1e1e]'}`}>
              {timeLeft !== 'Market Closed' && <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              <span className={`text-xs font-medium font-mono tracking-wide ${timeLeft === 'Market Closed' ? 'text-[#FF1744] font-bold text-[10px] uppercase' : 'text-gray-300'}`}>{timeLeft}</span>
            </div>
          )}
          {isLoading ? (
            <span className="text-xs text-blue-400 animate-pulse">Syncing...</span>
          ) : !hasHistory ? (
            <span className="text-[10px] text-yellow-500/70 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
              Live Only (History Restricted)
            </span>
          ) : null}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status === 'live' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-600'}`}></span>
            <span className={`text-xs font-medium ${status === 'live' ? 'text-green-500' : 'text-gray-600'}`}>
              {status === 'live' ? 'Live' : 'Connecting'}
            </span>
          </div>
        </div>
      </div>

      <div className="relative w-full flex-grow bg-black rounded-b-xl">
        <div ref={chartContainerRef} className="absolute inset-0" />
      </div>
    </div>
  );
};

