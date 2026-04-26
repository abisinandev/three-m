import type { AdminDashboardData } from "../../types/dashboard.types";

interface UserGrowthChartProps {
    data: AdminDashboardData['charts']['userGrowth'];
}

export const UserGrowthChart = ({ data }: UserGrowthChartProps) => {
    return (
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">User & Premium Growth</h3>
                <span className="text-[10px] text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">+28.4%</span>
            </div>
            <div className="h-48 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                    <path
                        d="M 20 160 Q 100 100, 180 120 T 340 80 L 380 70"
                        stroke="#10b981"
                        strokeWidth="2"
                        fill="none"
                        className="opacity-80"
                    />
                    <path
                        d="M 20 160 L 20 180 Q 100 180 180 180 T 340 180 L 380 180 L 380 70"
                        fill="#10b98120"
                    />
                </svg>
                <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[9px] uppercase tracking-wider text-gray-600">
                    {data.map((g) => (
                        <span key={g.month}>{g.month}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};
