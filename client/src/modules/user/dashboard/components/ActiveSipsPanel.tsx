import { Clock, ChevronRight, Calendar } from 'lucide-react';
import { formatCurrency } from '../../helpers/format';
import { Skeleton } from './Skeleton';
import type { DashboardSip } from '../types/dashboard.types';

export const ActiveSipsPanel = ({ recentSips, isLoading }: { recentSips: DashboardSip[]; isLoading: boolean }) => {
    return (
        <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">Active SIPs</h3>
                </div>
                <button className="text-[9px] text-blue-400 hover:text-blue-300 flex items-center transition-colors font-medium">
                    Manage SIPs <ChevronRight className="w-3 h-3 ml-0.5" />
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
                    : recentSips.length > 0 ? recentSips.map((sip) => (
                        <div key={sip.id} style={{ background: '#141517', border: '1px solid #1e2025', borderRadius: 6 }} className="flex items-center justify-between p-3 hover:border-[#2a2a2a] transition-colors group cursor-pointer">
                            <div className="flex items-center gap-3">
                                {sip.logo ? (
                                    <img src={sip.logo} alt={sip.schemeName || sip.schemeCode} className="w-8 h-8 rounded object-contain bg-white" />
                                ) : (
                                    <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-[11px] text-gray-200 font-semibold line-clamp-1">{sip.schemeName || sip.schemeCode}</p>
                                    <p className="text-[9px] text-gray-500 mt-0.5">
                                        {sip.frequency} • Next: {new Date(sip.nextExecutionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[11px] font-bold text-gray-100">{formatCurrency(sip.amount)}</p>
                                <p className="text-[9px] text-emerald-500 mt-0.5 font-medium">
                                    {sip.executedInstallments}/{sip.totalInstallments} Paid
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="py-8 flex flex-col items-center justify-center text-gray-600 border border-dashed border-[#1f1f1f] rounded-md">
                            <p className="text-[10px] uppercase tracking-widest font-medium">No Active SIPs</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
