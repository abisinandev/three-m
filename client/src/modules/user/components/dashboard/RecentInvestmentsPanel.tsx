import { Zap, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../helpers/format';
import { Skeleton } from './Skeleton';
import type { DashboardInvestment } from '../../types/dashboard.types';

export const RecentInvestmentsPanel = ({ recentInvestments, isLoading }: { recentInvestments: DashboardInvestment[]; isLoading: boolean }) => {
    return (
        <div className="bg-[#0f0f0f] rounded-md border border-[#1f1f1f] p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">Recent Investments</h3>
                </div>
                <button className="text-[9px] text-blue-400 hover:text-blue-300 flex items-center transition-colors font-medium">
                    History <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
            </div>

            <div className="space-y-2">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-3 rounded bg-[#161616] border border-[#1f1f1f]">
                            <Skeleton className="h-3 w-40 mb-2" />
                            <Skeleton className="h-2 w-24" />
                        </div>
                    ))
                    : recentInvestments.length > 0 ? recentInvestments.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between p-3 rounded bg-[#161616] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold ${inv.investmentType === 'SIP' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    {inv.investmentType === 'SIP' ? 'SIP' : 'LSP'}
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-200 font-semibold">{inv.schemeCode}</p>
                                    <p className="text-[9px] text-gray-500 mt-0.5">
                                        {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[11px] font-bold text-gray-100">{formatCurrency(inv.amount)}</p>
                                <p className="text-[9px] text-gray-500 mt-0.5">
                                    NAV: {inv.nav?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="py-8 flex flex-col items-center justify-center text-gray-600 border border-dashed border-[#1f1f1f] rounded-md">
                            <p className="text-[10px] uppercase tracking-widest font-medium">No Investments yet</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
