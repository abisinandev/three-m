import { Zap, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../helpers/format';
import { Skeleton } from './Skeleton';
import type { DashboardInvestment } from '../types/dashboard.types';

export const RecentInvestmentsPanel = ({ recentInvestments, isLoading }: { recentInvestments: DashboardInvestment[]; isLoading: boolean }) => {
    return (
        <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Recent Investments</h3>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center transition-colors font-semibold uppercase tracking-wide">
                    History <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
            </div>

            <div className="space-y-2">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} style={{ background: '#141517', border: '1px solid #1e2025', borderRadius: 6 }} className="p-3">
                            <Skeleton className="h-3 w-40 mb-2" />
                            <Skeleton className="h-2 w-24" />
                        </div>
                    ))
                    : recentInvestments.length > 0 ? recentInvestments.map((inv) => (
                        <div key={inv.id} style={{ background: '#141517', border: '1px solid #1e2025', borderRadius: 6 }} className="flex items-center justify-between p-3 hover:border-[#2a2a2a] transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                {inv.logo ? (
                                    <img src={inv.logo} alt={inv.schemeName || inv.schemeCode} className="w-8 h-8 rounded object-contain bg-white" />
                                ) : (
                                    <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${inv.investmentType === 'SIP' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                        {inv.investmentType === 'SIP' ? 'SIP' : 'LSP'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-200 font-semibold line-clamp-1">{inv.schemeName || inv.schemeCode}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-base font-bold text-gray-100 tabular-nums">{formatCurrency(inv.amount)}</p>
                                <p className="text-xs text-gray-500 mt-1 tabular-nums">
                                    NAV: {inv.nav?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="py-8 flex flex-col items-center justify-center text-gray-600 border border-dashed border-[#1f1f1f] rounded-md">
                            <p className="text-xs uppercase tracking-widest font-semibold">No Investments yet</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
