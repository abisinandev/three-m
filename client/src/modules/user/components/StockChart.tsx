import React, { useRef, useState } from 'react';
import { useRealtimeChart } from '@modules/user/hooks/useRealtimeChart';

interface StockChartProps {
  symbol: string;
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

export const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<string>('1');

  const { isLoading } = useRealtimeChart(chartContainerRef, symbol, timeframe);

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
        <div className="ml-auto flex items-center gap-2">
          {isLoading && <span className="text-xs text-blue-400 animate-pulse">Syncing...</span>}
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          <span className="text-xs text-green-500 font-medium">Real-time</span>
        </div>
      </div>

      <div className="relative w-full flex-grow bg-black rounded-b-xl">
        <div ref={chartContainerRef} className="absolute inset-0" />
      </div>
    </div>
  );
};
