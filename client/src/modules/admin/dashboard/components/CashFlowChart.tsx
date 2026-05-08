import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { AdminDashboardData } from '../types/dashboard.types';

interface CashFlowChartProps {
    data: AdminDashboardData['charts']['cashFlow'];
}

export const CashFlowChart = ({ data }: CashFlowChartProps) => {
    return (
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4 flex flex-col h-[280px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">Weekly Cash Flow</h3>
                <div className="flex gap-3 text-[10px] font-medium">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                        <span className="text-gray-400">Deposits</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                        <span className="text-gray-400">Withdrawals</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                        <XAxis
                            dataKey="week"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#5a5f6e', fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#5a5f6e', fontSize: 10 }}
                            tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`}
                            width={40}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#0f0f0f',
                                border: '1px solid #1f1f1f',
                                borderRadius: '4px',
                                fontSize: '10px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#fff', padding: '2px 0' }}
                            cursor={{ fill: '#1f1f1f' }}
                            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                        />
                        <Bar dataKey="deposits" fill="#10b981" radius={[2, 2, 0, 0]} barSize={12} />
                        <Bar dataKey="withdrawals" fill="#ef4444" radius={[2, 2, 0, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
