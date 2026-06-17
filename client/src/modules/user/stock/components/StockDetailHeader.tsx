import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import stockCurrencyService from "@/shared/services/external/stock-currency.service";

import type { StockDetailHeaderProps } from "@/shared/types/stock/stock.types";

export const StockDetailHeader = ({
  symbol,
  stockInfo,
  currentPrice,
  change,
  changePercent,
  isPositive,
  onTradeClick,
  isVerified,
}: StockDetailHeaderProps) => {
  const fmt = (v: number | string | null | undefined, digits = 2) => {
    if (v === undefined || v === null || isNaN(Number(v))) return "0.00";
    return Number(v).toLocaleString("en-IN", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  return (
    <div className="border-b border-[#1e2025] bg-[#0b0c0e] sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/user/stocks"
            className="text-[#5a5f6e] hover:text-[#e8eaed] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-6 w-[1px] bg-[#1e2025] mx-1"></div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#111214] border border-[#1e2025] flex items-center justify-center overflow-hidden shrink-0">
              {stockInfo.logo ? (
                <img
                  src={stockInfo.logo}
                  alt=""
                  className="w-5 h-5 object-contain"
                />
              ) : (
                <span className="text-xs font-bold text-[#5a5f6e]">
                  {(stockInfo.symbol || symbol).slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-[#e8eaed]">
                  {stockInfo.symbol || symbol}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#1e2025] text-[#5a5f6e] font-bold uppercase tracking-wider">
                  {stockInfo.exchange || "NSE"}
                </span>
              </div>
              <span className="text-xs text-[#5a5f6e] font-medium leading-none">
                {stockInfo.name || symbol}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-bold tracking-tight tabular-nums">
              {stockCurrencyService.formatCurrency(currentPrice, "INR")}
            </div>
            <div
              className={`text-xs font-bold flex items-center justify-end gap-1 tabular-nums ${isPositive ? "text-[#00C853]" : "text-[#FF1744]"
                }`}
            >
              <span>
                {isPositive ? "+" : ""}
                {fmt(change)} ({isPositive ? "+" : ""}
                {(changePercent || 0).toFixed(2)}%)
              </span>

            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onTradeClick("buy")}
              className={`px-5 py-1.5 bg-[#00C853] text-white text-xs font-bold rounded hover:bg-[#00e676] transition-all active:scale-95 uppercase tracking-wider ${!isVerified ? 'opacity-50 grayscale cursor-not-allowed active:scale-100' : ''}`}
            >
              Buy
            </button>
            <button
              onClick={() => onTradeClick("sell")}
              className={`px-5 py-1.5 bg-[#FF1744] text-[#e8eaed] text-xs font-bold rounded hover:bg-[#ff5252] transition-all active:scale-95 uppercase tracking-wider ${!isVerified ? 'opacity-50 grayscale cursor-not-allowed active:scale-100' : ''}`}
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

