import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { AdminDashboardData } from '../types/dashboard.types';

interface InvestmentDistributionDonutProps {
    data: AdminDashboardData['charts']['investmentDistribution'];
    totalAum: number;
    formatCurrency: (val: number) => string;
}

export const InvestmentDistributionDonut = ({ data, totalAum, formatCurrency }: InvestmentDistributionDonutProps) => {
    const chartData = [
        { name: 'Mutual Funds', value: data.mf, color: '#10b981' },
        { name: 'Stocks', value: data.stocks, color: '#3b82f6' },
        { name: 'Algo', value: data.algo, color: '#8b5cf6' },
    ];

    return (
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4 flex flex-col h-[280px]">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">Asset Distribution</h3>
                <span className="text-[10px] text-gray-500 font-medium px-1.5 py-0.5 rounded bg-[#1f1f1f]">AUM</span>
            </div>

            <div className="flex-1 relative min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: '#0f0f0f',
                                border: '1px solid #1f1f1f',
                                borderRadius: '4px',
                                fontSize: '10px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#fff', padding: '2px 0' }}
                            formatter={(value: number | string) => [formatCurrency(Number(value)), 'Allocation']}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-4">
                    <div className="text-center">
                        <div className="text-sm font-bold text-gray-100 tracking-tight">{formatCurrency(totalAum)}</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider">Total AUM</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                {chartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[9px] text-gray-400 uppercase font-medium">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
