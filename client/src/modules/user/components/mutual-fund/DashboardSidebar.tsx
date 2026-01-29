import React from 'react';
import { Zap, History } from 'lucide-react';

interface NavUpdate {
    fund: string;
    nav: number;
    change: number;
    date: string;
}

interface DashboardSidebarProps {
    recentNAVUpdates: NavUpdate[];
    onNewSipClick: () => void;
    onOneTimeClick: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    recentNAVUpdates,
    onNewSipClick,
    onOneTimeClick
}) => {
    return (
        <div className="lg:col-span-4 space-y-5">
            <div className="bg-gradient-to-br from-green-950/30 to-green-900/20 border border-green-900/40 rounded-xl p-4 shadow-sm">
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-green-100">
                    <Zap size={16} className="text-green-400" />
                    Quick Actions
                </h3>
                <div className="grid gap-2.5">
                    <button
                        onClick={onNewSipClick}
                        className="py-2.5 bg-green-600 hover:bg-green-700 rounded-lg font-medium text-sm transition-all transform active:scale-[0.98] text-white shadow-lg shadow-green-900/20"
                    >
                        Start New SIP
                    </button>
                    <button
                        onClick={onOneTimeClick}
                        className="py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-medium text-sm transition-all transform active:scale-[0.98] text-gray-200"
                    >
                        One-time Investment
                    </button>
                </div>
            </div>

            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-200">
                    <History size={16} className="text-green-400" />
                    Recent NAV Updates
                </h3>
                <div className="space-y-3 text-xs max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                    {recentNAVUpdates.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1.5 border-b border-[#1a1a1a] last:border-0">
                            <div className="truncate flex-1 pr-2">
                                <p className="font-medium text-gray-200 truncate">{item.fund}</p>
                                <p className="text-gray-500 mt-0.5">₹{item.nav.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-3 border-t border-[#1a1a1a]">
                    <p className="text-[10px] text-gray-600 text-center italic">
                        Updated: 22 Jan 2026 (daily post-market)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardSidebar;
