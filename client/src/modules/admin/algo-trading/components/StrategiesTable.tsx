import { FC } from 'react';
import dayjs from 'dayjs';
import { RefreshCw, Search } from 'lucide-react';
import type { AdminStrategy } from '@/shared/types/admin/algo-trading.types';

interface StrategiesTableProps {
    items: AdminStrategy[];
    isLoading: boolean;
    search: string;
    onSearchChange: (val: string) => void;
}

export const StrategiesTable: FC<StrategiesTableProps> = ({
    items,
    isLoading,
    search,
    onSearchChange
}) => {
    return (
        <div className="bg-[#111214] rounded-xl border border-[#1e2025] overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#1e2025] flex justify-between items-center bg-[#111214]">
                <h2 className="text-[14px] font-semibold text-white uppercase tracking-wider">Strategies</h2>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5f6e]" />
                    <input
                        type="text"
                        placeholder="Search strategies..."
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
                            <th style={headerStyle}>Strategy Name</th>
                            <th style={headerStyle}>Status</th>
                            <th style={headerStyle}>Users Count</th>
                            <th style={headerStyle}>Last Signal Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#111214]">
                        {isLoading ? (
                            <LoadingRow colSpan={4} unit="strategies" />
                        ) : items.length === 0 ? (
                            <EmptyRow colSpan={4} unit="strategies" />
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="border-b border-[#1e2025] hover:bg-[#15171a] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="text-[13px] font-semibold text-white mb-0.5">{item.strategyName}</div>
                                        <div className="text-[11px] text-[#5a5f6e] font-mono tracking-tight">ID: {item.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${item.isActive ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${item.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 w-40">
                                            <div className="flex-1 h-1 bg-[#1a1c20] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${Math.min((item.usersCount || 0) * 10, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[13px] text-white font-medium w-4">{item.usersCount || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] text-[#5a5f6e]">
                                        {item.lastSignalTime ? dayjs(item.lastSignalTime).format('MMM DD, YYYY HH:mm') : '—'}
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

export const LoadingRow = ({ colSpan, unit }: { colSpan: number, unit: string }) => (
    <tr>
        <td colSpan={colSpan} className="px-6 py-20 text-center text-[#5a5f6e] text-[13px]">
            <div className="flex flex-col items-center gap-3">
                <RefreshCw size={24} className="animate-spin text-emerald-500/50" />
                <span>Loading {unit}...</span>
            </div>
        </td>
    </tr>
);

export const EmptyRow = ({ colSpan, unit }: { colSpan: number, unit: string }) => (
    <tr>
        <td colSpan={colSpan} className="px-6 py-20 text-center text-[#5a5f6e] text-[13px]">
            <div className="flex flex-col items-center gap-2">
                <Search size={24} className="text-[#1a1c20]" />
                <span>No {unit} found matching your criteria.</span>
            </div>
        </td>
    </tr>
);
