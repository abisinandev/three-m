import type { AdminDashboardData } from "../../types/dashboard.types";

interface CashFlowChartProps {
    data: AdminDashboardData['charts']['cashFlow'];
}

export const CashFlowChart = ({ data }: CashFlowChartProps) => {
    const maxCashFlow = Math.max(...data.map(cf => Math.max(cf.deposits, cf.withdrawals)), 1);

    return (
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">Weekly Cash Flow</h3>
                <span className="text-[10px] text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">Net +₹2.1M</span>
            </div>
            <div className="h-48 flex items-center justify-center relative">
                <div className="flex gap-4 items-end h-32 w-full justify-center">
                    {data.map((cf) => (
                        <div key={cf.week} className="flex gap-1 items-end h-full group relative">
                            <div className="w-8 bg-emerald-500 rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity" style={{ height: `${(cf.deposits / maxCashFlow) * 100}%` }}></div>
                            <div className="w-8 bg-red-400 rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity" style={{ height: `${(cf.withdrawals / maxCashFlow) * 100}%` }}></div>
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end text-center pb-1 pointer-events-none">
                    <div className="flex justify-center gap-6 mt-4 text-[9px] text-gray-500 uppercase tracking-wider font-medium">
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Deposits</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-400 rounded-full"></div> Withdrawals</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
