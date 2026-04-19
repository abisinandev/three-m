import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import stockCurrencyService from "@shared/services/stockCurrency.service";

interface StockDetailHeaderProps {
  symbol: string;
  stockInfo: any;
  currentPrice: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  onTradeClick: (type: "buy" | "sell") => void;
}

export const StockDetailHeader = ({
  symbol,
  stockInfo,
  currentPrice,
  change,
  changePercent,
  isPositive,
  onTradeClick,
}: StockDetailHeaderProps) => {
  const fmt = (v: any, digits = 2) => {
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
            to="/user/trading"
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
                <span className="text-[10px] font-bold text-[#5a5f6e]">
                  {(stockInfo.symbol || symbol).slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-[#e8eaed]">
                  {stockInfo.symbol || symbol}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1e2025] text-[#5a5f6e] font-bold uppercase tracking-wider">
                  {stockInfo.exchange || "NSE"}
                </span>
              </div>
              <span className="text-[10px] text-[#5a5f6e] font-medium leading-none">
                {stockInfo.name || symbol}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-bold tracking-tight">
              {stockCurrencyService.formatCurrency(currentPrice, "INR")}
            </div>
            <div
              className={`text-[10px] font-bold flex items-center justify-end gap-1 ${
                isPositive ? "text-[#00C853]" : "text-[#FF1744]"
              }`}
            >
              <span>
                {isPositive ? "+" : ""}
                {fmt(change)} ({isPositive ? "+" : ""}
                {changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onTradeClick("buy")}
              className="px-5 py-1.5 bg-[#00C853] text-white text-[11px] font-bold rounded hover:bg-[#00e676] transition-all active:scale-95 uppercase tracking-wider"
            >
              Buy
            </button>
            <button
              onClick={() => onTradeClick("sell")}
              className="px-5 py-1.5 bg-[#FF1744] text-[#e8eaed] text-[11px] font-bold rounded hover:bg-[#ff5252] transition-all active:scale-95 uppercase tracking-wider"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
