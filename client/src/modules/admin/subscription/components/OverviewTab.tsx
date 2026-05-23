import { useQuery } from "@tanstack/react-query";
import { CreditCard, Users, Activity, LayoutGrid } from "lucide-react";
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import subscriptionService from "@/shared/services/subscription/subscription-service";
import type { SubscriptionTrendChartProps } from "./types/overview.types";

const SubscriptionTrendChart = ({ data }: SubscriptionTrendChartProps) => {
    return (
        <div className="bg-[#111] border border-neutral-800/60 rounded-xl p-5 w-full h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-neutral-200">Revenue & Subscriptions</h3>
                    <p className="text-[11px] text-neutral-500 mt-1">Monthly performance breakdown</p>
                </div>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm bg-neutral-700" />
                        <span className="text-[11px] text-neutral-400 font-medium">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[11px] text-neutral-400 font-medium">New Subs</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#555"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#555"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000) + 'k' : v}`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#555"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            hide
                        />
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: '#1A1A1A',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: '500', padding: '2px 0' }}
                            labelStyle={{ color: '#888', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', borderBottom: '1px solid #333', paddingBottom: '6px' }}
                            cursor={{ fill: '#222', opacity: 0.4 }}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="revenue"
                            fill="#2A2A2A"
                            radius={[2, 2, 0, 0]}
                            barSize={32}
                            name="Revenue"
                        >
                            {
                                (data || []).map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === (data?.length || 0) - 1 ? '#333' : '#222'} />
                                ))
                            }
                        </Bar>
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="subscriptions"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#111', stroke: '#3b82f6', strokeWidth: 2 }}
                            activeDot={{ r: 5, fill: '#3b82f6', stroke: '#111', strokeWidth: 2 }}
                            name="Subscriptions"
                            animationDuration={1500}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const OverviewTab = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["admin-subscription-stats"],
        queryFn: subscriptionService.getOverviewStats,
    });

    if (isLoading) return <div className="grid grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-neutral-900/50 rounded-xl animate-pulse" />)}</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Revenue", value: `₹${stats?.totalRevenue?.toLocaleString() || "0"}`, sub: "Value of active commitments", icon: CreditCard, color: "text-emerald-400" },
                    { label: "Total Subs", value: stats?.totalSubscriptions?.toLocaleString() || "0", sub: "Lifetime count", icon: Users, color: "text-blue-400" },
                    { label: "Active Now", value: stats?.activeSubscriptions?.toLocaleString() || "0", sub: "Currently subscribed", icon: Activity, color: "text-amber-400" },
                    { label: "Plan Tiers", value: `${stats?.subscriptionPlans?.length || 0}`, sub: "Available options", icon: LayoutGrid, color: "text-purple-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#111111] border border-neutral-800/50 p-4 rounded-xl hover:border-neutral-700/50 transition-colors group shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider font-sans">{stat.label}</span>
                            <stat.icon className={`w-4 h-4 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-[9px] text-neutral-500 font-medium">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <SubscriptionTrendChart data={stats?.monthlyGrowth} />
                </div>
                <div className="bg-[#111] border border-neutral-800/60 rounded-xl p-5 flex flex-col">
                    <h3 className="text-sm font-semibold text-neutral-200 mb-6">Plan Adoption</h3>
                    <div className="space-y-5 flex-1 flex flex-col justify-center">
                        {stats?.subscriptionPlans?.map((plan, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between text-[12px]">
                                    <span className="font-medium text-neutral-300">{plan.code === 'PREMIUM' ? 'Premium' : 'Free'} Tier</span>
                                    <div className="text-right">
                                        <span className="text-neutral-200 font-semibold">{plan.count}</span>
                                        <span className="text-neutral-500 ml-1.5">{plan.percentage?.toFixed(1) || "0.0"}%</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-neutral-800/80 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${plan.code === 'PREMIUM' ? 'bg-blue-500' : 'bg-neutral-500'}`}
                                        style={{ width: `${plan.percentage || 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-[#111] border border-neutral-800/60 rounded-xl p-5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-neutral-200">Recent Memberships</h3>
                    <button className="text-[11px] text-blue-400 hover:text-blue-300 font-medium">View All</button>
                </div>
                <div className="grid grid-cols-1 divide-y divide-neutral-800/60 border-t border-neutral-800/60">
                    {stats?.recentSubscribers?.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between py-3 hover:bg-neutral-800/20 px-2 -mx-2 rounded-md transition-colors">
                            <div className="flex items-center gap-3">
                                <div>
                                    <div className="text-[13px] font-medium text-neutral-200">{sub.fullName}</div>
                                    <div className="text-[11px] text-neutral-500 mt-0.5">{sub.email}</div>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-6">
                                <div className="hidden sm:block text-right">
                                    <div className="text-[12px] font-medium text-neutral-300">{sub.planCode === 'PREMIUM' ? 'Premium' : 'Free'}</div>
                                    <div className="text-[11px] text-neutral-500">{new Date(sub.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="text-[13px] font-semibold text-neutral-200 w-16 text-right">
                                    ₹{sub.amount}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;

