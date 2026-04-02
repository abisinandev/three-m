import React, { useRef } from 'react';
import { useMarketData } from '@shared/hooks/useMarketData';

interface RealtimeChartProps {
    symbol: string;
    timeframe?: string;
    className?: string;
}

const RealtimeChart: React.FC<RealtimeChartProps> = ({ symbol, timeframe = '1', className = "h-full w-full" }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const { isLoading, currentPrice, status } = useMarketData(chartContainerRef, symbol, timeframe);

    return (
        <div className={`relative ${className}`}>
            {/* Header / Current Price Overlay */}
            <div className="absolute top-4 left-4 z-10 flex flex-col pointer-events-none">
                <span className="text-xl font-bold text-white tracking-widest">{symbol}</span>
                {currentPrice !== null ? (
                    <span className="text-3xl font-semibold text-[#22c55e]">
                        ₹{currentPrice.toFixed(2)}
                    </span>
                ) : (
                    <span className="text-3xl font-semibold text-gray-500 animate-pulse">
                        Loading...
                    </span>
                )}
            </div>

            {/* Error Overlay */}
            {status === 'error' && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 pointer-events-none">
                    <span className="text-red-500 font-medium px-4 py-2 rounded-md bg-red-950/20">
                        Error fetching historical data
                    </span>
                </div>
            )}

            {/* Chart Container */}
            <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
            
            {/* Loader overlay */}
            {isLoading && (
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#000000]/80 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
                     <div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin mb-4"></div>
                     <span className="text-gray-400 text-sm">Synchronizing Data...</span>
                 </div>
            )}
        </div>
    );
};

export default RealtimeChart;
