import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time, DeepPartial, ChartOptions } from 'lightweight-charts';
import { socketService } from '@/socket/socket';
import { marketDataService } from '@/shared/services/external/market-data.service';

export interface Candle {
    time: Time;
    open: number;
    high: number;
    low: number;
    close: number;
}

const CHART_OPTIONS: DeepPartial<ChartOptions> = {
    layout: {
        background: { color: 'transparent' },
        textColor: '#D9D9D9',
        fontFamily: "'Inter', sans-serif",
    },
    grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false,
    },
    rightPriceScale: {
        borderVisible: false,
        alignLabels: true,
    },
    crosshair: {
        mode: 0,
    },
    handleScroll: true,
    handleScale: true,
};

export const useMarketData = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    symbol: string,
    timeframe: string = '1',
) => {
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const latestCandleRef = useRef<Candle | null>(null);
    
    // For Interpolation
    const targetPriceRef = useRef<number | null>(null);
    const animationFrameId = useRef<number | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

    useEffect(() => {
        if (!containerRef.current) return;

        const chart = createChart(containerRef.current, CHART_OPTIONS);
        chartRef.current = chart;

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });
        seriesRef.current = candlestickSeries;

        const handleResize = () => {
            if (containerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [containerRef]);

    useEffect(() => {
        let isMounted = true;

        const fetchHistoricalData = async () => {
            if (!symbol || !seriesRef.current) return;
            setIsLoading(true);
            setStatus('loading');

            seriesRef.current.setData([]);
            latestCandleRef.current = null;
            setCurrentPrice(null);

            try {
                const now = Math.floor(Date.now() / 1000);
                const from = now - (14 * 24 * 60 * 60); // 14 days baseline

                const response = await marketDataService.getHistoricalCandles(symbol, timeframe, from, now);

                if (response && response.s === 'ok' && response.t && response.t.length > 0 && isMounted) {
                    const formattedData: Candle[] = response.t.map((timeIndex: number, idx: number) => ({
                        time: timeIndex as Time,
                        open: response.o[idx],
                        high: response.h[idx],
                        low: response.l[idx],
                        close: response.c[idx],
                    }));

                    seriesRef.current.setData(formattedData);
                    const lastCandle = formattedData[formattedData.length - 1];
                    latestCandleRef.current = lastCandle;
                    setCurrentPrice(lastCandle.close);
                    targetPriceRef.current = lastCandle.close;
                    setStatus('live');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Historical Data fetching Error:', error);
                if (isMounted) setStatus('error');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchHistoricalData();

        // WS Connection
        socketService.connect();
        let backendTimeframe = '1m';
        switch (timeframe) {
            case '1': backendTimeframe = '1m'; break;
            case '5': backendTimeframe = '5m'; break;
            case '15': backendTimeframe = '15m'; break;
            case '30': backendTimeframe = '30m'; break;
            case '60': backendTimeframe = '1h'; break;
            case 'D': backendTimeframe = '1d'; break;
            default: backendTimeframe = '1m'; break;
        }

        socketService.subscribeToCandle(symbol, backendTimeframe);

        const handleCandleUpdate = (update: Candle & { symbol?: string, timeframe?: string }) => {
            if (!seriesRef.current || !update) return;

            const formattedUpdate: Candle = {
                time: update.time as Time,
                open: update.open,
                high: update.high,
                low: update.low,
                close: update.close
            };
            
            // For interpolation, we set the target price instead of immediate visual jump
            targetPriceRef.current = formattedUpdate.close;
            // Immediate update for the rest of the candle structure
            latestCandleRef.current = formattedUpdate;
            
            if (isMounted) setCurrentPrice(formattedUpdate.close);
        };

        socketService.on('candle-update', handleCandleUpdate);

        // Smooth Interpolation Loop
        const animatePrice = () => {
            if (latestCandleRef.current && seriesRef.current && targetPriceRef.current !== null) {
                const current = latestCandleRef.current.close;
                const target = targetPriceRef.current;
                
                // Diff and interpolation step (~10% gap closure per frame at 60fps)
                if (Math.abs(target - current) > 0.01) {
                    const step = (target - current) * 0.1;
                    const interpolatedPrice = current + step;

                    latestCandleRef.current = {
                        ...latestCandleRef.current,
                        close: interpolatedPrice,
                        high: Math.max(latestCandleRef.current.high, interpolatedPrice),
                        low: Math.min(latestCandleRef.current.low, interpolatedPrice)
                    };
                    
                    seriesRef.current.update(latestCandleRef.current);
                } else if (current !== target) {
                     // Snap to target if very close
                     latestCandleRef.current.close = targetPriceRef.current;
                     seriesRef.current.update(latestCandleRef.current);
                }
            }
            animationFrameId.current = requestAnimationFrame(animatePrice);
        };

        animationFrameId.current = requestAnimationFrame(animatePrice);

        return () => {
            isMounted = false;
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            socketService.off('candle-update', handleCandleUpdate);
            socketService.unsubscribeFromCandle(symbol, backendTimeframe);
        };
    }, [symbol, timeframe]);

    return { isLoading, currentPrice, status };
};

