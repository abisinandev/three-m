import { type FC } from 'react';
import dayjs from 'dayjs';
import { Search } from 'lucide-react';
import { LoadingRow, EmptyRow } from './StrategiesTable';
import type { AdminSignal } from '@/shared/types/admin/algo-trading.types';

interface SignalsTableProps {
    items: AdminSignal[];
    isLoading: boolean;
    search: string;
    onSearchChange: (val: string) => void;
}

export const SignalsTable: FC<SignalsTableProps> = ({
    items,
    isLoading,
    search,
    onSearchChange
}) => {
    return (
        <div className="bg-[#111214] rounded-xl border border-[#1e2025] overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#1e2025] flex justify-between items-center bg-[#111214]">
                <h2 className="text-[14px] font-semibold text-white uppercase tracking-wider">Signals</h2>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5f6e]" />
                    <input
                        type="text"
                        placeholder="Search signals..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-3 py-1.5 bg-[#0b0c0e] border border-[#1e2025] rounded-md text-[13px] text-white focus:outline-none focus:border-emerald-500/50 w-[240px] placeholder-[#5a5f6e] transition-all font-medium"
                    />
                </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#1e2025] bg-[#111214]">
                            <th style={headerStyle}>ID / Symbol</th>
                            <th style={headerStyle}>Strategy</th>
                            <th style={headerStyle}>Action</th>
                            <th style={headerStyle}>Price</th>
                            <th style={headerStyle}>Status</th>
                            <th style={headerStyle}>Created At</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#111214]">
                        {isLoading ? (
                            <LoadingRow colSpan={6} unit="signals" />
                        ) : items.length === 0 ? (
                            <EmptyRow colSpan={6} unit="signals" />
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="border-b border-[#1e2025] hover:bg-[#15171a] transition-colors group text-[13px]">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-white mb-0.5">{item.symbol}</div>
                                        <div className="text-[10px] text-[#5a5f6e] font-mono tracking-tight">{item.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[#e8eaed] font-medium">
                                        {item.strategyName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {item.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-white">
                                        ₹{parseFloat(item.price as string).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                                            item.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                item.status === 'EXPIRED' ? 'bg-[#1a1c20] text-[#5a5f6e]' :
                                                    'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[11px] text-[#5a5f6e]">
                                        {dayjs(item.createdAt).format('MMM DD, HH:mm')}
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

const headerStyle: Record<string, string | number> = {
    fontSize: 10,
    fontWeight: 600,
    color: '#5a5f6e',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    padding: '10px 24px',
    textAlign: 'left'
};
