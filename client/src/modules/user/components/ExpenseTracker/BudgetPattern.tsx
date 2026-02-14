import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@modules/user/helpers/expenseHelpers';

interface BudgetPatternProps {
    finalChartData: any[];
    activeChartData: any[];
    filteredSpent: number;
    filteredInvested: number;
    totalIncome: number;
    needsTarget: number;
    wantsTarget: number;
    savingsTarget: number;
    filteredNeeds: number;
    filteredWants: number;
}

export const BudgetPattern = ({
    finalChartData,
    activeChartData,
    filteredSpent,
    filteredInvested,
    totalIncome,
    needsTarget,
    wantsTarget,
    savingsTarget,
    filteredNeeds,
    filteredWants
}: BudgetPatternProps) => {
    return (
        <div className="lg:col-span-1 bg-[#111] rounded-2xl p-6 border border-neutral-800/60 flex flex-col items-center justify-center relative min-h-[300px]">
            <h3 className="absolute top-6 left-6 text-sm font-bold text-white uppercase tracking-wide">
                Budget Distribution
            </h3>
            <div className="absolute top-6 right-6 text-[10px] font-bold bg-neutral-800/50 px-2 py-1 rounded text-neutral-400 border border-neutral-700">
                50-30-20 Rule
            </div>

            <div className="w-full h-56 relative mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={finalChartData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                        >
                            {activeChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            {activeChartData.length === 0 && <Cell fill="#1a1a1a" />}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '12px', padding: '12px', border: '1px solid #222' }}
                            itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                            cursor={{ fill: 'transparent' }}
                            formatter={(val: any, name?: string) => {
                                return [formatCurrency(val), name || ''];
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Filtered Spend</span>
                    <span className="text-lg font-bold text-white mt-0.5">{formatCurrency(filteredSpent + filteredInvested)}</span>
                </div>
            </div>

            {/* Custom Legend */}
            <div className="w-full mt-6 grid grid-cols-3 gap-2 px-2">
                <div className="flex flex-col items-center">
                    <div className="w-full h-1 bg-blue-500/20 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (filteredNeeds / (totalIncome * (needsTarget || 0.5))) * 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Needs</span>
                    <span className="text-xs font-bold text-blue-400">{Math.round((filteredNeeds / totalIncome) * 100) || 0}%</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-full h-1 bg-amber-500/20 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (filteredWants / (totalIncome * (wantsTarget || 0.3))) * 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Wants</span>
                    <span className="text-xs font-bold text-amber-500">{Math.round((filteredWants / totalIncome) * 100) || 0}%</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-full h-1 bg-emerald-500/20 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (filteredInvested / (totalIncome * (savingsTarget || 0.2))) * 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Savings</span>
                    <span className="text-xs font-bold text-emerald-500">{Math.round((filteredInvested / totalIncome) * 100) || 0}%</span>
                </div>
            </div>
        </div>
    );
};
