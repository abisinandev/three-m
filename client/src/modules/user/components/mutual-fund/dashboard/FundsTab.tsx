import React from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { FUND_FILTERS } from '../../../constants/mutualFundConstants';
import { toggleFundFilter } from '../../../helper/ToggleFilter';

interface FundsTabProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedFilters: string[];
    setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
    fundsLoading: boolean;
    funds: any[];
    onFundClick: (schemeCode: string) => void;
}

const FundsTab: React.FC<FundsTabProps> = ({
    searchTerm,
    setSearchTerm,
    selectedFilters,
    setSelectedFilters,
    fundsLoading,
    funds,
    onFundClick
}) => {
    return (
        <>
            <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search funds by name or category..."
                            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 py-2 text-sm text-gray-200 focus:outline-none focus:border-green-600/50"
                        />
                    </div>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors whitespace-nowrap"
                    >
                        Clear
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    {FUND_FILTERS.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setSelectedFilters(prev => toggleFundFilter(prev, filter))}
                            className={`px-3 py-1 text-xs rounded-full transition-all ${selectedFilters.includes(filter)
                                ? 'bg-green-900/50 text-green-300 border border-green-700/60'
                                : 'bg-[#1a1a1a] text-gray-400 hover:text-gray-200 border border-transparent hover:border-gray-600'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[#111214] border border-[#1e2025] rounded-lg divide-y divide-[#1e2025] mt-4">
                {fundsLoading ? (
                    <div className="py-12 text-center text-gray-500">Loading funds...</div>
                ) : funds.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">No funds found</div>
                ) : (
                    funds.map((fund) => (
                        <div
                            key={fund.id || fund.schemeCode}
                            onClick={() => onFundClick(fund.schemeCode)}
                            className="px-5 py-3.5 hover:bg-[#181818] transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {fund.logo ? (
                                        <img
                                            src={fund.logo}
                                            alt={`${fund.schemeName} logo`}
                                            className="w-full h-full object-contain p-1"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <span className="text-lg font-semibold text-gray-500">
                                            {fund.schemeName?.charAt(0) || '?'}
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white truncate group-hover:text-green-400 transition-colors">
                                        {fund.schemeName || 'Unknown Scheme'}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                                        {fund.amc || 'AMC Name'}{' '}
                                        <span className="text-gray-600">•</span>{' '}
                                        {fund.category || 'Equity'}{' '}
                                        {fund.subCategory && (
                                            <span className="text-gray-600">• {fund.subCategory}</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <p className="text-base font-semibold text-white">
                                    ₹{fund.nav || '—'}
                                </p>
                                <div className="flex items-center justify-end gap-1.5 mt-1">
                                    <TrendingUp
                                        size={14}
                                        className={
                                            (fund.cagr?.cagr1Y || 0) >= 0
                                                ? 'text-green-400'
                                                : 'text-red-400'
                                        }
                                    />
                                    <span
                                        className={`text-sm font-medium ${(fund.cagr?.cagr1Y || 0) >= 0
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                            }`}
                                    >
                                        {(fund.cagr?.cagr1Y || 0).toFixed(1)}% 1Y
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default FundsTab;
