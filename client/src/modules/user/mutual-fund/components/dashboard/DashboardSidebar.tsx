import React from 'react';
import { History } from 'lucide-react';

interface NavUpdate {
    fund: string;
    nav: number;
    change: number;
    date: string;
}

interface DashboardSidebarProps {
    recentNAVUpdates: NavUpdate[];
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    recentNAVUpdates,
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[#1e2025] mb-4">
                    <h3 className="text-[13px] font-semibold text-[#e8eaed] flex items-center gap-2 m-0 leading-none">
                        <History className="w-3.5 h-3.5 text-[#5a5f6e]" />
                        Recent NAV Updates
                    </h3>
                </div>

                <div className="space-y-3 text-xs max-h-[400px]  custom-scrollbar">
                    {recentNAVUpdates.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-[#1e2025] last:border-0 hover:bg-[#1a1c20] px-2 -mx-2 rounded transition-colors group">
                            <div className="truncate flex-1 pr-2">
                                <p className="font-semibold text-[#e8eaed] truncate transition-colors">
                                    {item.fund}
                                </p>
                                <p className="text-[#aab0c0] font-mono mt-1 text-[11px]">
                                    ₹{item.nav.toFixed(2)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold font-mono text-[11px] ${item.change >= 0 ? 'text-[#00C853]' : 'text-[#FF1744]'}`}>
                                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                                </p>
                                <p className="text-[10px] text-[#5a5f6e] mt-1 font-medium">{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 pt-3 border-t border-[#1e2025]">
                    <p className="text-[10px] text-[#5a5f6e] text-center font-medium">
                        Updated Daily (Post-Market)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardSidebar;
