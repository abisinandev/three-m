import { StatRow } from "./StatRow";

interface MarketDepthCardProps {
  volume: number;
  previousClose: number;
  sessionHigh: number;
  sessionLow: number;
}

export const MarketDepthCard = ({
  volume,
  previousClose,
  sessionHigh,
  sessionLow,
}: MarketDepthCardProps) => {
  const fmt = (v: any, digits = 2) => {
    if (v === undefined || v === null || isNaN(Number(v))) return "0.00";
    return Number(v).toLocaleString("en-IN", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  return (
    <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5 space-y-4">
      <p className="text-[11px] font-bold text-[#5a5f6e] uppercase tracking-widest">
        Market Depth
      </p>
      <div className="space-y-3">
        <StatRow
          label="Avg Volume"
          value={fmt(volume / 1000000, 2) + "M"}
        />
        <StatRow
          label="Previous Close"
          value={`₹${fmt(previousClose)}`}
        />
        <StatRow
          label="Session High"
          value={`₹${fmt(sessionHigh)}`}
        />
        <StatRow
          label="Session Low"
          value={`₹${fmt(sessionLow)}`}
        />
      </div>
    </div>
  );
};
