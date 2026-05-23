'use client';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownLeft, Activity, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface AnalyticsViewProps {
    data: {
        comparison?: { thisMonth: number; lastMonth: number; difference: number; percentageChange: number };
        categoryComparison?: { name: string; thisMonth: number; lastMonth: number }[];
        spendingTrend?: { day: string; thisMonth: number; lastMonth: number }[];
        insights?: { type: 'critical' | 'success' | 'warning'; title: string; text: string }[];
        healthScore?: number;
    } | undefined;
    formatCurrency: (val?: number) => string;
    selectedMonth: string;
}

export const AnalyticsView = ({ data, formatCurrency, selectedMonth }: AnalyticsViewProps) => {
    const [viewType, setViewType] = useState<'monthly' | 'daily'>('monthly');

    if (!data) return (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#5a5f6e' }}>
            <Activity className="animate-pulse" size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>ANALYZING DATA...</p>
        </div>
    );

    const {
        comparison = { thisMonth: 0, lastMonth: 0, difference: 0, percentageChange: 0 },
        categoryComparison = [],
        spendingTrend = [],
        insights = [],
        healthScore = 0
    } = data || {};

    const getInsightStyle = (type: string) => {
        switch (type) {
            case 'critical': return { textColor: 'text-[#F43F5E]', boxClass: 'bg-rose-500/5 border border-rose-500/10 text-[#F43F5E]' };
            case 'success': return { textColor: 'text-[#00C853]', boxClass: 'bg-green-500/5 border border-green-500/10 text-[#00C853]' };
            default: return { textColor: 'text-amber-500', boxClass: 'bg-amber-500/5 border border-amber-500/10 text-amber-500' };
        }
    };

    return (
        <div className="flex flex-col gap-4">

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#111214] border border-[#1e2025] rounded-lg py-4 px-5 relative overflow-hidden">
                    <p className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.08em] m-0 mb-1">{selectedMonth}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-xl font-bold text-[#e8eaed] m-0">{formatCurrency(comparison.thisMonth)}</h3>
                        {comparison.percentageChange !== 0 && (
                            <div className={`flex items-center text-[10px] font-extrabold ${comparison.difference > 0 ? 'text-[#F43F5E]' : 'text-[#00C853]'}`}>
                                {comparison.difference > 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                {Math.abs(Math.round(comparison.percentageChange))}%
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#111214] border border-[#1e2025] rounded-lg py-4 px-5 relative overflow-hidden">
                    <p className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.08em] m-0 mb-1">Previous Month</p>
                    <h3 className="text-xl font-bold text-[#5a5f6e] m-0">{formatCurrency(comparison.lastMonth)}</h3>
                </div>

                <div className={`rounded-lg py-4 px-5 relative overflow-hidden border ${comparison.difference > 0 ? 'bg-rose-500/[0.03] border-rose-500/[0.15]' : 'bg-green-500/[0.03] border-green-500/[0.15]'}`}>
                    <p className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.08em] m-0 mb-1">Net Variance</p>
                    <h3 className={`text-xl font-bold m-0 ${comparison.difference > 0 ? 'text-[#F43F5E]' : 'text-[#00C853]'}`}>
                        {comparison.difference > 0 ? '+' : '-'}{formatCurrency(Math.abs(comparison.difference))}
                    </h3>
                </div>
            </div>


            <div className="grid grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
                {/* Visual Insights Section */}
                <div className="flex flex-col gap-4">
                    <div className="bg-[#111214] border border-[#1e2025] rounded-lg py-4 px-5 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xs font-bold text-[#e8eaed] uppercase m-0">{viewType === 'monthly' ? 'Category Breakdown' : 'Daily Velocity'}</h3>
                                <p className="text-[10px] text-[#5a5f6e] font-semibold mt-0.5 m-0">Trend analysis for {selectedMonth}</p>
                            </div>

                            <div className="flex bg-[#0b0c0e] border border-[#1e2025] rounded-md p-0.5 gap-0.5">
                                <button
                                    onClick={() => setViewType('monthly')}
                                    className={`px-2.5 py-1 text-[9px] font-extrabold rounded cursor-pointer border-none transition-all duration-150 ${viewType === 'monthly' ? 'bg-[#1e2025] text-[#e8eaed]' : 'bg-transparent text-[#5a5f6e]'}`}
                                >
                                    MONTHLY
                                </button>
                                <button
                                    onClick={() => setViewType('daily')}
                                    className={`px-2.5 py-1 text-[9px] font-extrabold rounded cursor-pointer border-none transition-all duration-150 ${viewType === 'daily' ? 'bg-[#1e2025] text-[#e8eaed]' : 'bg-transparent text-[#5a5f6e]'}`}
                                >
                                    DAILY
                                </button>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {viewType === 'monthly' ? (
                                    <BarChart data={categoryComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#16181d" vertical={false} />
                                        <XAxis dataKey="name" stroke="#3a3d45" fontSize={9} fontWeight={700} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#3a3d45" fontSize={9} fontWeight={700} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                                        <RechartsTooltip
                                            cursor={{ fill: '#16181d' }}
                                            contentStyle={{ backgroundColor: '#0b0c0e', border: '1px solid #1e2025', borderRadius: 8, padding: '8px 12px' }}
                                            itemStyle={{ fontSize: 10, fontWeight: 700 }}
                                        />
                                        <Bar dataKey="thisMonth" fill="#3B82F6" radius={[3, 3, 0, 0]} barSize={16}>
                                            {categoryComparison.map((entry: { name: string }, index: number) => (
                                                <Cell key={index} fill={entry.name === 'SAVING' ? '#00C853' : entry.name === 'WANT' ? '#f59e0b' : '#3B82F6'} />

                                            ))}
                                        </Bar>
                                        <Bar dataKey="lastMonth" fill="#1e2025" radius={[3, 3, 0, 0]} barSize={16} />
                                    </BarChart>
                                ) : (
                                    <LineChart data={spendingTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#16181d" vertical={false} />
                                        <XAxis dataKey="day" stroke="#3a3d45" fontSize={9} fontWeight={700} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#3a3d45" fontSize={9} fontWeight={700} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                                        <RechartsTooltip
                                        />
                                        <Line type="monotone" dataKey="thisMonth" stroke="#3B82F6" strokeWidth={2} dot={false} strokeLinecap="round" />
                                        <Line type="monotone" dataKey="lastMonth" stroke="#3a3d45" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-[#111214] border border-[#1e2025] rounded-lg py-4 px-5 relative overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 mb-5">
                            <Lightbulb size={14} color="#f59e0b" />
                            <h3 className="text-[11px] font-bold text-[#e8eaed] uppercase m-0">SMART INSIGHTS</h3>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            {insights.length === 0 && (
                                <p className="text-[10px] text-[#5a5f6e] italic m-0">No critical trends identified.</p>
                            )}
                            {insights.map((insight: { type: 'critical' | 'success' | 'warning'; title: string; text: string }, idx: number) => {
                                const s = getInsightStyle(insight.type);
                                return (
                                    <div key={idx} className={`rounded-md py-2.5 px-3 ${s.boxClass}`}>
                                        <p className="text-[11px] font-bold m-0 mb-0.5">{insight.title || 'Note'}</p>
                                        <p className="text-[10px] text-[#e8eaed] opacity-80 leading-[1.4] m-0">{insight.text}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-[#1e2025]">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-[0.08em] m-0 mb-1">Budget Health</p>
                                    <p className="text-lg font-extrabold text-white m-0">{healthScore}%</p>
                                </div>
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${healthScore >= 80 ? 'bg-green-500/10 text-[#00C853]' : 'bg-rose-500/10 text-[#F43F5E]'}`}>
                                    {healthScore >= 80 ? 'OPTIMAL' : 'STRESS'}
                                </span>
                            </div>
                            <div className="h-1 w-full bg-[#0b0c0e] rounded-sm overflow-hidden">
                                <div className={`h-full ${healthScore >= 80 ? 'bg-[#00C853]' : 'bg-[#F43F5E]'}`} style={{ width: `${healthScore}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
