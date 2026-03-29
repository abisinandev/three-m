import { useEffect, useRef } from "react";

type TradingViewWidgetProps = {
  symbol: string; 
};

export type TradingViewConfig = {
  autosize: boolean;
  symbol: string;
  interval: "1" | "3" | "5" | "15" | "30" | "60" | "D" | "W" | "M";
  timezone: string;
  theme: "dark" | "light";
  style: "1" | "2" | "3"; // 1 = candlestick
  locale: string;
  enable_publishing: boolean;
  hide_top_toolbar: boolean;
  hide_side_toolbar: boolean;
  allow_symbol_change: boolean;
  details: boolean;
  calendar: boolean;
  backgroundColor: string;
  gridColor: string;
  studies: string[];
};

const TradingViewWidget = ({ symbol }: TradingViewWidgetProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!symbol || !containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const config: TradingViewConfig = {
      autosize: true,
      symbol,
      interval: "15",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_side_toolbar: true,
      allow_symbol_change: false,
      details: false,
      calendar: false,
      backgroundColor: "#0F0F0F",
      gridColor: "rgba(255,255,255,0.06)",
      studies: [],
    };

    script.innerHTML = JSON.stringify(config);

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full tradingview-widget-container"
    />
  );
};

export default TradingViewWidget;