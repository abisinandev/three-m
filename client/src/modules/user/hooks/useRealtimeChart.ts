import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time, DeepPartial, ChartOptions } from 'lightweight-charts';
import { socketService } from '@shared/services/socket';
import { finnhubService } from '@shared/services/finnhub.service';

export interface Candle {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface TradeUpdate {
  symbol: string;
  price: number;
  timestamp: number;
}

const CHART_OPTIONS: DeepPartial<ChartOptions> = {
  layout: {
    background: { color: '#000000' },
    textColor: '#D9D9D9',
    fontFamily: "'Inter', sans-serif",
  },
  grid: {
    vertLines: { color: '#1F1F1F' },
    horzLines: { color: '#1F1F1F' },
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

export const useRealtimeChart = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  symbol: string,
  timeframe: string = '1',
) => {
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const currentCandleRef = useRef<Candle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  // Initialize Chart
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
    candlestickSeriesRef.current = candlestickSeries;

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

  // Fetch initial data & Handle Real-time synchronization
  useEffect(() => {
    let isMounted = true;
    
    const fetchHistoricalData = async () => {
      if (!symbol || !candlestickSeriesRef.current) return;
      setIsLoading(true);

      // Reset Series for new symbol/timeframe
      candlestickSeriesRef.current.setData([]);
      currentCandleRef.current = null;
      setCurrentPrice(null);

      try {
        const now = Math.floor(Date.now() / 1000);
        let from;

        // Dynamic range based on timeframe
        switch (timeframe) {
          case '1': from = now - 24 * 60 * 60; break;
          case '5': from = now - 5 * 24 * 60 * 60; break;
          case '15': from = now - 15 * 24 * 60 * 60; break;
          case 'D': from = now - 365 * 24 * 60 * 60; break;
          default:
            const tfNum = parseInt(timeframe);
            if (!isNaN(tfNum)) {
                from = now - (tfNum * 200 * 60);
            } else {
                from = now - 24 * 60 * 60;
            }
        }

        const response = await finnhubService.getStockCandles(symbol, timeframe, from, now);
        const data = response.data;
        
        if (data && data.s === 'ok' && data.t && data.t.length > 0 && isMounted) {
          const formattedData: Candle[] = data.t.map((timestamp: number, index: number) => ({
            time: timestamp as Time,
            open: data.o[index],
            high: data.h[index],
            low: data.l[index],
            close: data.c[index],
          }));

          candlestickSeriesRef.current.setData(formattedData);
          const lastCandle = formattedData[formattedData.length - 1];
          currentCandleRef.current = lastCandle;
          setCurrentPrice(lastCandle.close);
        }
      } catch (error) {
        console.error('Failed to fetch historical candles:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistoricalData();

    // Setup Socket connection
    socketService.connect();
    socketService.subscribeToSymbol(symbol);

    const getInterval = (tf: string): number => {
        if (tf === 'D') return 24 * 60 * 60;
        if (tf === 'W') return 7 * 24 * 60 * 60;
        const num = parseInt(tf);
        return isNaN(num) ? 60 : num * 60;
    };

    const handleStockUpdate = (trade: TradeUpdate) => {
      if (trade.symbol !== symbol || !candlestickSeriesRef.current) return;
      
      const price = trade.price;
      const timestampSeconds = Math.floor(trade.timestamp / 1000);
      const interval = getInterval(timeframe);
      const candleTime = Math.floor(timestampSeconds / interval) * interval;

      if (isMounted) setCurrentPrice(price);

      if (!currentCandleRef.current) {
        const newCandle: Candle = {
          time: candleTime as Time,
          open: price,
          high: price,
          low: price,
          close: price
        };
        currentCandleRef.current = newCandle;
        candlestickSeriesRef.current.update(newCandle);
        return;
      }

      const lastCandle = currentCandleRef.current;
      
      if (Number(lastCandle.time) === candleTime) {
        // Update same candle
        const updatedCandle: Candle = {
          ...lastCandle,
          high: Math.max(lastCandle.high, price),
          low: Math.min(lastCandle.low, price),
          close: price,
        };
        currentCandleRef.current = updatedCandle;
        candlestickSeriesRef.current.update(updatedCandle);
      } else if (candleTime > Number(lastCandle.time)) {
        // Create new candle
        const newCandle: Candle = {
          time: candleTime as Time,
          open: lastCandle.close,
          high: Math.max(lastCandle.close, price),
          low: Math.min(lastCandle.close, price),
          close: price,
        };
        currentCandleRef.current = newCandle;
        candlestickSeriesRef.current.update(newCandle);
      }
    };

    socketService.on('stock_update', handleStockUpdate);

    return () => {
      isMounted = false;
      socketService.off('stock_update', handleStockUpdate);
      socketService.unsubscribeFromSymbol(symbol);
    };
  }, [symbol, timeframe]);

  return { isLoading, currentPrice };
};
