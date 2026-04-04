import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time, DeepPartial, ChartOptions, IPriceLine } from 'lightweight-charts';
import { socketService } from '@shared/services/socket';
import api from '@lib/axiosUser';
import { API_ROUTES } from '@shared/constants/apiRoutes';
// [DISABLED] Finnhub is disconnected - Yahoo is used via backend now.
// import { finnhubService } from '@shared/services/finnhub.service';

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
  position?: any,
  showPosition?: boolean
) => {
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const currentCandleRef = useRef<Candle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');
  const [hasHistory, setHasHistory] = useState(false);

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  const priceLineRef = useRef<IPriceLine | null>(null);

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

  // Fetch initial data & handle real-time synchronization
  useEffect(() => {
    let isMounted = true;

    // --- Map timeframe to backend format (for WS room subscription) ---
    let backendTimeframe = '1m';
    switch (timeframe) {
      case '1':  backendTimeframe = '1m';  break;
      case '5':  backendTimeframe = '5m';  break;
      case '15': backendTimeframe = '15m'; break;
      case '30': backendTimeframe = '15m'; break; // 30m maps to 15m (Yahoo doesn't have 30m)
      case '60': backendTimeframe = '1h';  break;
      case 'D':  backendTimeframe = '1d';  break;
      case 'W':  backendTimeframe = '1d';  break; // weekly maps to daily
      default:   backendTimeframe = '1m';  break;
    }

    // --- Step 1: Register candle-update listener IMMEDIATELY (before async fetch) ---
    const handleCandleUpdate = (candleUpdate: Candle & { symbol?: string; timeframe?: string }) => {
      if (!candlestickSeriesRef.current || !isMounted) return;

      setCurrentPrice(candleUpdate.close);

      const formattedUpdate: Candle = {
        time: candleUpdate.time as Time,
        open: candleUpdate.open,
        high: candleUpdate.high,
        low: candleUpdate.low,
        close: candleUpdate.close,
      };

      currentCandleRef.current = formattedUpdate;
      candlestickSeriesRef.current.update(formattedUpdate);
    };

    socketService.on('candle-update', handleCandleUpdate);

    // --- Step 2: Connect socket and subscribe (re-subscribe on reconnect too) ---
    socketService.connect();
    socketService.subscribeToCandle(symbol, backendTimeframe);

    // Re-subscribe after a reconnect so we don't miss updates when socket drops briefly
    const handleReconnect = () => {
      socketService.subscribeToCandle(symbol, backendTimeframe);
      console.log(`[Chart] Re-subscribed to ${symbol}:${backendTimeframe} after reconnect`);
    };
    socketService.on('connect', handleReconnect);

    // --- Step 3: Fetch historical candles ---
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
        let from: number;
        switch (timeframe) {
          case '1':  from = now - 3   * 24 * 60 * 60; break; // 3 days  (Yahoo 1m limit: 7d)
          case '5':  from = now - 59  * 24 * 60 * 60; break; // 59 days (Yahoo 5m limit: 60d)
          case '15': from = now - 59  * 24 * 60 * 60; break; // 59 days (Yahoo 15m limit: 60d)
          case '30': from = now - 59  * 24 * 60 * 60; break; // 59 days
          case '60': from = now - 180 * 24 * 60 * 60; break; // 180 days
          case 'D':  from = now - 730 * 24 * 60 * 60; break; // 2 years
          case 'W':  from = now - 730 * 24 * 60 * 60; break; // 2 years
          default:   from = now - 3   * 24 * 60 * 60;
        }

        // [DISABLED] Old Finnhub quote prefetch:
        // const quoteResponse = await finnhubService.getStockDetails(symbol);
        // const quote = quoteResponse?.data?.latestPrice;

        const params = new URLSearchParams({
          resolution: timeframe,
          from: String(from),
          to: String(now),
        });
        const rawResponse = await api.get(`${API_ROUTES.USER.STOCKS.GET_ALL}/${symbol}/candles?${params.toString()}`);
        const payload = rawResponse.data;
        // Unwrap standard response envelope: { success, data: { s, t, o, h, l, c, v } }
        const candleData = payload?.data || payload;

        if (candleData && candleData.s === 'ok' && candleData.t && candleData.t.length > 0 && isMounted) {
          const formattedData: Candle[] = candleData.t.map((timeIndex: number, idx: number) => ({
            time: timeIndex as Time,
            open:  candleData.o[idx],
            high:  candleData.h[idx],
            low:   candleData.l[idx],
            close: candleData.c[idx],
          }));

          candlestickSeriesRef.current?.setData(formattedData);
          const lastCandle = formattedData[formattedData.length - 1];
          currentCandleRef.current = lastCandle;
          setCurrentPrice(lastCandle.close);
          setHasHistory(true);
          setStatus('live');
        } else {
          // No history available — WebSocket updates will fill the chart
          if (isMounted) setStatus('live');
        }
      } catch (error: any) {
        console.error('[Chart] Historical data fetch error:', error);
        if (isMounted) setStatus('live');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistoricalData();

    // --- Step 4: Auto-advance candle boundary (gap fill) ---
    const interval = setInterval(() => {
      if (!currentCandleRef.current || !candlestickSeriesRef.current) return;

      let bucketSec = 60;
      switch (timeframe) {
        case '1':  bucketSec = 60;          break;
        case '5':  bucketSec = 5  * 60;     break;
        case '15': bucketSec = 15 * 60;     break;
        case '30': bucketSec = 30 * 60;     break;
        case '60': bucketSec = 60 * 60;     break;
        case 'D':  bucketSec = 24 * 60 * 60; break;
        default:   bucketSec = 60;
      }

      const nowSec = Math.floor(Date.now() / 1000);
      const currentCandleTime = Number(currentCandleRef.current.time);

      if (nowSec >= currentCandleTime + bucketSec) {
        const missedBuckets = Math.floor((nowSec - currentCandleTime) / bucketSec);
        if (missedBuckets > 0) {
          const closePrice = currentCandleRef.current.close;
          const nextTime = (currentCandleTime + missedBuckets * bucketSec) as Time;
          const blankCandle: Candle = {
            time:  nextTime,
            open:  closePrice,
            high:  closePrice,
            low:   closePrice,
            close: closePrice,
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
      socketService.off('connect', handleReconnect);
      socketService.unsubscribeFromCandle(symbol, backendTimeframe);
    };
  }, [symbol, timeframe]);

  // Manage Price Line & ToolTip overlays for position
  useEffect(() => {
    if (!candlestickSeriesRef.current || !chartRef.current || !position || !showPosition || (!position.amount && !position.investedAmount) || (!position.units && !position.quantity)) {
      if (priceLineRef.current && candlestickSeriesRef.current) {
        candlestickSeriesRef.current.removePriceLine(priceLineRef.current);
        priceLineRef.current = null;
      }
      return;
    }

    const qty = position.units || position.quantity || 0;
    const avgPriceValue = position.avgPrice ?? (position.amount / qty);

    const isProfit = currentPrice !== null && currentPrice > avgPriceValue;
    const isLoss = currentPrice !== null && currentPrice < avgPriceValue;
    const lineColor = isProfit ? '#22c55e' : (isLoss ? '#ef4444' : '#eab308');

    if (!priceLineRef.current) {
      priceLineRef.current = candlestickSeriesRef.current.createPriceLine({
        price: avgPriceValue,
        color: lineColor,
        lineWidth: 1,
        lineStyle: 2, // LineStyle.Dashed
        axisLabelVisible: true,
        title: `Avg Buy ₹${avgPriceValue.toFixed(2)} (${qty} Qty)`,
      });
    } else {
      priceLineRef.current.applyOptions({
        color: lineColor,
        price: avgPriceValue,
      });
    }

    // Tooltip logic
    const container = containerRef.current;
    if (!container) return;
    
    let toolTip = document.getElementById('chart-position-tooltip');
    if (!toolTip) {
      toolTip = document.createElement('div');
      toolTip.id = 'chart-position-tooltip';
      toolTip.style.width = '180px';
      toolTip.style.position = 'absolute';
      toolTip.style.display = 'none';
      toolTip.style.padding = '12px';
      toolTip.style.boxSizing = 'border-box';
      toolTip.style.fontSize = '12px';
      toolTip.style.textAlign = 'left';
      toolTip.style.zIndex = '1000';
      toolTip.style.pointerEvents = 'none';
      toolTip.style.border = '1px solid #2a2a2a';
      toolTip.style.borderRadius = '8px';
      toolTip.style.fontFamily = "'Inter', sans-serif";
      toolTip.style.background = '#0a0a0a';
      toolTip.style.color = '#fff';
      toolTip.style.boxShadow = '0 6px 16px rgba(0,0,0,0.6)';
      toolTip.style.transition = 'opacity 0.2s, top 0.1s, left 0.1s';
      container.appendChild(toolTip);
    }

    const handleCrosshairMove = (param: any) => {
        if (!param.point || !toolTip) {
            toolTip!.style.display = 'none';
            return;
        }

        const priceY = candlestickSeriesRef.current?.priceToCoordinate(avgPriceValue);
        
        // If mouse is near the price line Y coordinate (+- 20 pixels)
        if (priceY !== null && priceY !== undefined && Math.abs(param.point.y - priceY) < 20) {
            const currentClose = currentCandleRef.current?.close ?? currentPrice ?? avgPriceValue;
            const pnl = (currentClose - avgPriceValue) * qty;
            const pnlColor = pnl >= 0 ? '#22c55e' : '#ef4444';
            const sign = pnl >= 0 ? '+' : '';

            toolTip.style.display = 'block';
            toolTip.style.left = (param.point.x + 20) + 'px';
            toolTip.style.top = (param.point.y + 20) + 'px';
            toolTip.innerHTML = `
                <div style="color: #9ca3af; font-size: 10px; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; letter-spacing: 0.05em">Trade Position</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #9ca3af">Avg Buy</span>
                    <span style="font-weight: 600">₹${avgPriceValue.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #9ca3af">Quantity</span>
                    <span style="font-weight: 600">${qty}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #9ca3af">Invested</span>
                    <span style="font-weight: 600">₹${(position.amount || position.investedAmount || 0).toFixed(0)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 8px; padding-top: 8px; border-top: 1px solid #1f1f1f;">
                    <span style="color: #9ca3af">Current P&L</span>
                    <span style="font-weight: 700; color: ${pnlColor}">${sign}₹${pnl.toFixed(2)}</span>
                </div>
            `;
        } else {
            toolTip.style.display = 'none';
        }
    };

    chartRef.current.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
        chartRef.current?.unsubscribeCrosshairMove(handleCrosshairMove);
        if (container.contains(toolTip)) container.removeChild(toolTip!);
    };
  }, [position, showPosition, currentPrice]);

  return { isLoading, currentPrice, status, hasHistory };
};
