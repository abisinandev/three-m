'use client';
import { useState, useMemo } from 'react';
import { TrendingUp, Search, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { FUND_FILTERS } from '../contants/mutualFundContants';
import { toggleFundFilter } from '../helper/ToggleFilter';
import { fetchMutualFunds } from '@shared/services/feature/mutual-fund/MutualFundApisUserSide';

const MutualFundPage = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['All Funds']);
    const [expandedFund, setExpandedFund] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [debouncedSearch] = useDebounce(searchTerm, 400);

    const queryKey = useMemo(
        () => ['user-funds-list', debouncedSearch, selectedFilters],
        [debouncedSearch, selectedFilters]
    );

    const { data = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => fetchMutualFunds(debouncedSearch, selectedFilters),
        placeholderData: p => p,
    });

    console.log("DAta: ", data);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-semibold text-[#E5E7EB]">
                        Mutual Funds
                    </h1>
                    <p className="text-[11px] text-[#6B7280] mt-1">
                        Overview of your mutual fund investments
                    </p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/10 transition">
                    <Plus size={14} />
                    Invest
                </button>
            </div>

            <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] uppercase tracking-wide text-[#9CA3AF]">
                        Filter by Fund Type
                    </p>
                    <button
                        onClick={() => {
                            setSelectedFilters(['All Funds']);
                            setSearchTerm('');
                        }}
                        className="text-[11px] text-[#22C55E] hover:underline"
                    >
                        Clear All
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {FUND_FILTERS.map(filter => (
                        <button
                            key={filter}
                            onClick={() =>
                                setSelectedFilters(prev =>
                                    toggleFundFilter(prev, filter)
                                )
                            }
                            className={`px-3 py-1 text-xs rounded-md transition ${selectedFilters.includes(filter)
                                ? 'bg-[#171717] text-[#E5E7EB] border border-[#333]'
                                : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search funds..."
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg pl-9 pr-4 py-2 text-xs text-[#E5E7EB]"
                />
            </div>

            <div className="divide-y divide-[#1f1f1f] bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg">
                {isLoading && (
                    <p className="p-4 text-center text-[11px] text-[#6B7280]">
                        Loading funds...
                    </p>
                )}

                {!isLoading && data.length === 0 && (
                    <p className="p-4 text-center text-[11px] text-[#6B7280]">
                        No funds found
                    </p>
                )}

                {data.map(fund => (
                    <div
                        key={fund.id}
                        className="flex items-center justify-between p-4 hover:bg-[#111] cursor-pointer"
                        onClick={() =>
                            setExpandedFund(prev =>
                                prev === fund.id ? null : fund.id
                            )
                        }
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-9 h-9 rounded-full border border-[#2a2a2a] bg-[#0f0f0f] flex items-center justify-center overflow-hidden flex-shrink-0">
                                {fund.logo ? (
                                    <img
                                        src={fund.logo}
                                        alt={`${fund.schemeName} logo`}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <span className="text-[10px] font-semibold text-[#6B7280]">
                                        {fund.schemeName.charAt(0)}
                                    </span>
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-[#E5E7EB] truncate">
                                    {fund.schemeName}
                                </p>
                                <p className="text-[11px] text-[#6B7280] mt-0.5">
                                    {fund.category} · {fund.subCategory}
                                </p>
                            </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                            <p className="text-xs font-medium text-[#E5E7EB]">
                                ₹{fund.nav.toLocaleString()}
                            </p>
                            <p className="text-[11px] flex items-center justify-end gap-1 mt-0.5 text-[#22C55E]">
                                <TrendingUp size={12} />
                                {fund.cagr.cagr1Y}%
                            </p>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
};

export default MutualFundPage;
