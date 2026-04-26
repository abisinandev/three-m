import type { AdminDashboardData } from "../../types/dashboard.types";

interface InvestmentDistributionDonutProps {
    data: AdminDashboardData['charts']['investmentDistribution'];
    totalAum: number;
    formatCurrency: (val: number) => string;
}

export const InvestmentDistributionDonut = ({ totalAum, formatCurrency }: InvestmentDistributionDonutProps) => {
    return (
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">Investment Distribution</h3>
                <span className="text-[10px] text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">Global</span>
            </div>
            <div className="h-48 flex flex-col items-center justify-center gap-4">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#1a1a1a" strokeWidth="12" fill="none" />
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#3b82f6"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray="351"
                            strokeDashoffset="140"
                            className="transition-all duration-1000 opacity-90"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#10b981"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray="351"
                            strokeDashoffset="210"
                            className="transition-all duration-1000 opacity-90"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#8b5cf6"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray="351"
                            strokeDashoffset="280"
                            className="transition-all duration-1000 opacity-90"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-xl font-bold text-gray-100 tracking-tight">{formatCurrency(totalAum)}</div>
                            <div className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">Total AUM</div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 text-[9px] text-gray-500 uppercase tracking-wider font-medium">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#10b981] rounded-full"></div> MFs</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div> Stocks</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#8b5cf6] rounded-full"></div> Algo</span>
                </div>
            </div>
        </div>
    );
};
