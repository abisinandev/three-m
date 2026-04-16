import React from 'react';

interface AlgoTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const AlgoTabs: React.FC<AlgoTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex gap-1 mb-6 bg-[#111214] border border-[#1e2025] p-1 rounded-lg w-max shadow-sm">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${
                        activeTab === tab
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'text-[#5a5f6e] hover:text-white hover:bg-[#1a1c20]'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
