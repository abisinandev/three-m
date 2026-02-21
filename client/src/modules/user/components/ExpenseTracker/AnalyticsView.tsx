import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Activity, TrendingDown, AlertCircle, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface AnalyticsViewProps {
    data: any;
    formatCurrency: (val?: number) => string;
    selectedMonth: string;
}

export const AnalyticsView = ({ data, formatCurrency, selectedMonth }: AnalyticsViewProps) => {
    const [viewType, setViewType] = useState<'monthly' | 'daily'>('monthly');

    if (!data) return (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <Activity className="animate-pulse mb-4 text-neutral-700" size={48} />
            <p className="text-sm font-medium">Analyzing your financial data...</p>
        </div>
    );

    const {
        comparison = {
            thisMonth: 0,
            lastMonth: 0,
            difference: 0,
            percentageChange: 0
        },
        categoryComparison = [],
        spendingTrend = [],
        insights = [],
        healthScore = 0
    } = data || {};

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Monthly Comparison Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <TrendingUp size={64} />
                    </div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">{selectedMonth}</p>
                    <div className="flex items-baseline gap-2 relative z-10">
                        <h3 className="text-2xl font-black text-white">{formatCurrency(comparison.thisMonth)}</h3>
                        {comparison.percentageChange !== 0 && (
                            <div className={`flex items-center text-[10px] font-bold ${comparison.difference > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {comparison.difference > 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                {Math.abs(Math.round(comparison.percentageChange))}%
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 shadow-xl relative overflow-hidden group">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Previous Month</p>
                    <h3 className="text-2xl font-bold text-neutral-400">{formatCurrency(comparison.lastMonth)}</h3>
                </div>

                <div className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden ${comparison.difference > 0 ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-sans">Net Change</p>
                    <h3 className={`text-2xl font-black ${comparison.difference > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {comparison.difference > 0 ? '+' : '-'}{formatCurrency(Math.abs(comparison.difference))}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Insights Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* View Toggle */}
                    <div className="bg-[#111] p-1.5 rounded-xl border border-neutral-800 flex w-fit">
                        <button
                            onClick={() => setViewType('monthly')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewType === 'monthly' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Month Comparison
                        </button>
                        <button
                            onClick={() => setViewType('daily')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewType === 'daily' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Daily Trend
                        </button>
                    </div>

                    <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 min-h-[400px]">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{viewType === 'monthly' ? 'Top Category Comparison' : 'Daily Spending Trend'}</h3>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Data-driven spending breakdown</p>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {viewType === 'monthly' ? (
                                    <BarChart data={categoryComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="name" stroke="#555" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#555" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                                        <RechartsTooltip
                                            cursor={{ fill: '#333', opacity: 0.1 }}
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                                        />
                                        <Bar dataKey="thisMonth" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} name="This Month" />
                                        <Bar dataKey="lastMonth" fill="#222" radius={[4, 4, 0, 0]} barSize={20} name="Last Month" />
                                    </BarChart>
                                ) : (
                                    <LineChart data={spendingTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="day" stroke="#555" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#555" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                                        />
                                        <Line type="monotone" dataKey="thisMonth" stroke="#3B82F6" strokeWidth={3} dot={false} name="This Month" />
                                        <Line type="monotone" dataKey="lastMonth" stroke="#444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Last Month" />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Intelligent Insights Section */}
                <div className="space-y-6">
                    <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <Lightbulb size={18} className="text-amber-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Smart Insights</h3>
                        </div>

                        <div className="space-y-4">
                            {insights.length === 0 && (
                                <p className="text-xs text-neutral-600 italic">No significant trends detected this month.</p>
                            )}
                            {insights.map((insight: any, idx: number) => {
                                const getInsightStyle = (type: string) => {
                                    switch (type) {
                                        case 'critical': return { bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: 'text-rose-500', text: 'text-rose-400' };
                                        case 'warning': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-500', text: 'text-amber-400' };
                                        case 'success': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-500', text: 'text-emerald-400' };
                                        case 'neutral': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-500', text: 'text-blue-400' };
                                        default: return { bg: 'bg-neutral-800', border: 'border-neutral-700', icon: 'text-neutral-400', text: 'text-neutral-300' };
                                    }
                                };
                                const style = getInsightStyle(insight.type);

                                return (
                                    <div key={idx} className={`p-4 rounded-xl border flex gap-3 items-start transition-all hover:translate-x-1 ${style.bg} ${style.border}`}>
                                        <div className="mt-1">
                                            {insight.type === 'critical' ? <AlertCircle size={14} className={style.icon} /> :
                                                insight.type === 'warning' ? <AlertCircle size={14} className={style.icon} /> :
                                                    insight.type === 'success' ? <TrendingDown size={14} className={style.icon} /> :
                                                        <Activity size={14} className={style.icon} />}
                                        </div>
                                        <div>
                                            {insight.title && <h4 className={`text-xs font-bold mb-0.5 ${style.text}`}>{insight.title}</h4>}
                                            <p className={`text-xs font-medium leading-relaxed ${style.text} opacity-90`}>
                                                {insight.text}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Health Meter Hook */}
                            <div className="mt-8 pt-6 border-t border-neutral-800">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Health Score</h4>
                                        <p className="text-xl font-black text-white">{healthScore}%</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${healthScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' : healthScore >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        style={{ width: `${healthScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
