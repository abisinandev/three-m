import { Search } from 'lucide-react';
import type { AdminTrade } from '@/shared/types/admin/algo-trading.types';

interface TradesTableProps {
    items: AdminTrade[];
    isLoading: boolean;
    search: string;
    onSearchChange: (value: string) => void;
    type: string;
    onTypeChange: (value: string) => void;
}

export const TradesTable = ({ items, isLoading, search, onSearchChange, type, onTypeChange }: TradesTableProps) => {
    return (
        <div className="w-full">
            <div className="p-4 border-b border-[#1e2025] flex justify-between items-center gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5f6e]" size={16} />
                    <input
                        type="text"
                        placeholder="Search by User ID or Symbol..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-[#111214] border border-[#1e2025] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#e8eaed] placeholder-[#5a5f6e] focus:outline-none focus:border-[#2b2d35]"
                    />
                </div>
                
                <div className="flex bg-[#111214] border border-[#1e2025] rounded-md overflow-hidden">
                    {['All', 'Manual', 'Algo'].map((t) => (
                        <button
                            key={t}
                            onClick={() => onTypeChange(t)}
                            className={`px-3 py-1.5 text-xs transition-colors ${
                                type === t 
                                ? 'bg-[#2b2d35] text-[#e8eaed] font-medium' 
                                : 'text-[#5a5f6e] hover:text-[#e8eaed]'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#e8eaed]">
                    <thead className="bg-[#111214] border-b border-[#1e2025] text-[#5a5f6e] uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3 font-medium">Order ID</th>
                            <th className="px-6 py-3 font-medium">User ID</th>
                            <th className="px-6 py-3 font-medium">Symbol</th>
                            <th className="px-6 py-3 font-medium">Side</th>
                            <th className="px-6 py-3 font-medium">Type</th>
                            <th className="px-6 py-3 font-medium text-right">Qty</th>
                            <th className="px-6 py-3 font-medium text-right">Price</th>
                            <th className="px-6 py-3 font-medium text-right">Profit</th>
                            <th className="px-6 py-3 font-medium text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2025]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-[#5a5f6e]">
                                    <div className="animate-pulse flex flex-col items-center gap-2">
                                        <div className="h-4 w-24 bg-[#1e2025] rounded"></div>
                                        <div className="text-xs">Loading trades...</div>
                                    </div>
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-[#5a5f6e]">
                                    No trades found
                                </td>
                            </tr>
                        ) : (
                            items.map((trade) => (
                                <tr key={trade.id} className="hover:bg-[#151619] transition-colors">
                                    <td className="px-6 py-3 font-mono text-[#8b92a5]">{trade.orderId}</td>
                                    <td className="px-6 py-3 font-mono text-[#8b92a5]">{trade.userId}</td>
                                    <td className="px-6 py-3 font-medium">{trade.symbol}</td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${trade.side === 'BUY' ? 'bg-[#00c853]/10 text-[#00c853]' : 'bg-[#ff3d00]/10 text-[#ff3d00]'}`}>
                                            {trade.side}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${trade.isAlgoTrade ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                                            {trade.isAlgoTrade ? 'ALGO' : 'MANUAL'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">{trade.quantity}</td>
                                    <td className="px-6 py-3 text-right">{Number(trade.price).toFixed(2)}</td>
                                    <td className={`px-6 py-3 text-right font-medium ${!trade.profit ? 'text-[#5a5f6e]' : trade.profit > 0 ? 'text-[#00c853]' : 'text-[#ff3d00]'}`}>
                                        {trade.profit ? `${trade.profit > 0 ? '+' : ''}$${trade.profit.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="px-6 py-3 text-right text-[#8b92a5]">
                                        {new Date(trade.createdAt).toLocaleString(undefined, {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
