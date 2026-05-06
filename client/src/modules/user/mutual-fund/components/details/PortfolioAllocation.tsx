import React from 'react';

const PortfolioAllocation: React.FC = () => {
    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-5">
            <div className="text-[12px] font-bold text-[#e8eaed] uppercase tracking-wider mb-4 border-b border-[#2a2a2a] pb-2">
                Portfolio Allocation
            </div>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center text-[12px] mb-1 font-medium">
                        <span className="text-[#aab0c0]">Equity</span>
                        <span className="text-[#e8eaed]">92.4%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-[#2962ff] shadow-[0_0_8px_rgba(41,98,255,0.6)]" style={{ width: '92.4%' }} />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center text-[12px] mb-1 font-medium">
                        <span className="text-[#aab0c0]">Debt</span>
                        <span className="text-[#e8eaed]">4.1%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" style={{ width: '4.1%' }} />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center text-[12px] mb-1 font-medium">
                        <span className="text-[#aab0c0]">Cash / Equivalent</span>
                        <span className="text-[#e8eaed]">3.5%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" style={{ width: '3.5%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioAllocation;
