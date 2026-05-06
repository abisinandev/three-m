import React from 'react';
import { TrendingUp } from 'lucide-react';

interface NavHistoryItem {
    navDate: string;
    nav: number;
}

interface NavHistoryListProps {
    history: NavHistoryItem[];
}

const NavHistoryList: React.FC<NavHistoryListProps> = ({ history }) => {
    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-2 mb-4">
                <div className="text-[12px] font-bold text-[#e8eaed] uppercase tracking-wider">
                    NAV History
                </div>
                <TrendingUp size={14} className="text-[#6a7182]" />
            </div>
            <div className="space-y-0.5">
                {history.slice(0, 8).map((item, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center py-[7px] border-b border-[#1f1f1f] last:border-0 hover:bg-[#1a1a1a] px-2 -mx-2 rounded transition-colors"
                    >
                        <span className="text-[#aab0c0] text-[11px] font-medium tracking-wide">
                            {new Date(item.navDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[#e8eaed] text-[12px] font-mono tracking-tight font-medium">
                            ₹{item.nav.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NavHistoryList;
