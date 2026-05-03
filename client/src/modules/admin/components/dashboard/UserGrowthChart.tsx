import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AdminDashboardData } from "../../types/dashboard.types";

interface UserGrowthChartProps {
    data: AdminDashboardData['charts']['userGrowth'];
}

export const UserGrowthChart = ({ data }: UserGrowthChartProps) => {
    return (
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-4 flex flex-col h-[280px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">User & Premium Growth</h3>
                <span className="text-[10px] text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">+28.4%</span>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#5a5f6e', fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#5a5f6e', fontSize: 10 }}
                        />
                        <Tooltip 
                            contentStyle={{ background: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: '4px', fontSize: '10px' }}
                            itemStyle={{ padding: '0px' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="users" 
                            stroke="#10b981" 
                            fillOpacity={1} 
                            fill="url(#colorUsers)" 
                            strokeWidth={2}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="premium" 
                            stroke="#6366f1" 
                            fillOpacity={1} 
                            fill="url(#colorPremium)" 
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
