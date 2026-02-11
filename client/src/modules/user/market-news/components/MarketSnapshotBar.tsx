import { TrendingUp, TrendingDown, Clock } from "lucide-react";

const SNAPSHOT_DATA = [
    { label: "BTC/USDT", value: "$43,250.50", change: "+1.2%", isPositive: true },
    { label: "NIFTY 50", value: "21,782.45", change: "-0.45%", isPositive: false },
    { label: "SENSEX", value: "72,152.00", change: "+0.32%", isPositive: true },
    { label: "BANK NIFTY", value: "45,620.10", change: "-0.85%", isPositive: false },
    { label: "GOLD", value: "62,450", change: "+0.15%", isPositive: true },
];

export const MarketSnapshotBar = () => {
    return (
        <div className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-md border-b border-[#2D2D2D] overflow-hidden">
            <div className="flex items-center gap-8 py-2.5 px-6 animate-marquee whitespace-nowrap overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mr-4">
                    <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Market Live</span>
                </div>

                {SNAPSHOT_DATA.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 min-w-max">
                        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{item.label}</span>
                        <span className="text-xs font-semibold text-gray-300">{item.value}</span>
                        <div className={`flex items-center gap-0.5 text-xs font-bold ${item.isPositive ? 'text-[#22C55E]' : 'text-red-500'}`}>
                            {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {item.change}
                        </div>
                        {idx !== SNAPSHOT_DATA.length - 1 && <div className="h-3 w-px bg-[#2D2D2D] mx-2" />}
                    </div>
                ))}
            </div>
        </div>
    );
};
