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

  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');
  const [hasHistory, setHasHistory] = useState(false);

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
      setStatus('loading');
      setHasHistory(false);

      candlestickSeriesRef.current.setData([]);
      currentCandleRef.current = null;
      setCurrentPrice(null);

      try {
        const now = Math.floor(Date.now() / 1000);
        let from;

        switch (timeframe) {
          case '1': from = now - (3 * 24 * 60 * 60); break; // 3 days back for 1m to span weekends
          case '5': from = now - (7 * 24 * 60 * 60); break; // 7 days back for 5m
          case '15': from = now - (14 * 24 * 60 * 60); break; // 14 days back for 15m
          case '30': from = now - (30 * 24 * 60 * 60); break; // 30 days back for 30m
          case '60': from = now - (60 * 24 * 60 * 60); break; // 60 days back for 1h
          case 'D': from = now - (365 * 24 * 60 * 60); break; // 1 year back for Daily
          default:
            from = now - (3 * 24 * 60 * 60);
        }

        // 1. Fetch Quote from Finnhub as a fast baseline/fallback
        const quoteResponse = await finnhubService.getStockDetails(symbol);
        const quote = quoteResponse?.data?.latestPrice;
        if (quote && isMounted) {
          setCurrentPrice(quote);
        }

        // 2. Fetch Historical Candles from Finnhub (backend mapping to Alpaca)
        const response = await finnhubService.getStockCandles(symbol, timeframe, from, now);
        const candleData = response?.data;

        if (candleData && candleData.s === 'ok' && candleData.t && candleData.t.length > 0 && isMounted) {
          const formattedData: Candle[] = candleData.t.map((timeIndex: number, idx: number) => ({
            time: timeIndex as Time, 
            open: candleData.o[idx],
            high: candleData.h[idx],
            low: candleData.l[idx],
            close: candleData.c[idx],
          }));

          candlestickSeriesRef.current.setData(formattedData);
          const lastCandle = formattedData[formattedData.length - 1];
          currentCandleRef.current = lastCandle;
          setCurrentPrice(lastCandle.close);
          setHasHistory(true);
          setStatus('live');
        } else {
          // No history available - Use the quote to create a placeholder candle
          if (quote && isMounted && candlestickSeriesRef.current) {
            const candleTime = Math.floor(now / 60) * 60; // Align to 1m
            const placeholder: Candle = {
              time: candleTime as Time,
              open: quote,
              high: quote,
              low: quote,
              close: quote
            };
            candlestickSeriesRef.current.setData([placeholder]);
            currentCandleRef.current = placeholder;
          }
          setStatus('live');
        }
      } catch (error: any) {
        console.error('Historical Data Error:', error);
        setStatus('live');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistoricalData();

    // Setup Socket connection
    socketService.connect();
    
    // Subscribe to specific candle timeframe structure using backend logic
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

    const handleCandleUpdate = (candleUpdate: Candle & { symbol?: string, timeframe?: string }) => {
      if (!candlestickSeriesRef.current) return;

      if (isMounted) setCurrentPrice(candleUpdate.close);

      const formattedUpdate: Candle = {
        time: candleUpdate.time as Time,
        open: candleUpdate.open,
        high: candleUpdate.high,
        low: candleUpdate.low,
        close: candleUpdate.close
      };

      currentCandleRef.current = formattedUpdate;
      candlestickSeriesRef.current.update(formattedUpdate);
    };

    socketService.on('candle-update', handleCandleUpdate);

    // Auto-create blank candles on boundaries to simulate real-time feel even with no liquidity
    const interval = setInterval(() => {
      if (!currentCandleRef.current || !candlestickSeriesRef.current) return;
      
      let bucketSec = 60;
      switch (timeframe) {
        case '1': bucketSec = 60; break;
        case '5': bucketSec = 5 * 60; break;
        case '15': bucketSec = 15 * 60; break;
        case '30': bucketSec = 30 * 60; break;
        case '60': bucketSec = 60 * 60; break;
        case 'D': bucketSec = 24 * 60 * 60; break;
        default: bucketSec = 60; break;
      }

      const nowSec = Math.floor(Date.now() / 1000);
      const currentCandleTime = Number(currentCandleRef.current.time);
      
      if (nowSec >= currentCandleTime + bucketSec) {
          const missedBuckets = Math.floor((nowSec - currentCandleTime) / bucketSec);
          if (missedBuckets > 0) {
              const closePrice = currentCandleRef.current.close;
              const nextTime = (currentCandleTime + (missedBuckets * bucketSec)) as Time;
              const blankCandle: Candle = {
                  time: nextTime,
                  open: closePrice,
                  high: closePrice,
                  low: closePrice,
                  close: closePrice
              };
              currentCandleRef.current = blankCandle;
              candlestickSeriesRef.current.update(blankCandle);
          }
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      socketService.off('candle-update', handleCandleUpdate);
      socketService.unsubscribeFromCandle(symbol, backendTimeframe);
    };
  }, [symbol, timeframe]);

  return { isLoading, currentPrice, status, hasHistory };
};
