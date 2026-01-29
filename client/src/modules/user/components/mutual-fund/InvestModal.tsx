
import type { FundDetails } from '@modules/user/types/MutaulFundType';
import { formatNavDate } from '@shared/utils/mutual-fund.utils';
import { X } from 'lucide-react';
interface InvestModalProps {
    data: FundDetails;
    investment: number;
    setInvestment: (val: number) => void;
    errorMsg: string;
    setErrorMsg: (msg: string) => void;
    latestNav: number;
    units: number;
    onClose: () => void;
    onProceed: () => void;
}

export const InvestModal = ({
    data,
    investment,
    setInvestment,
    errorMsg,
    setErrorMsg,
    latestNav,
    units,
    onClose,
    onProceed,
}: InvestModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] px-6 py-4 flex items-center justify-between border-b border-[#222]">
                    <div className="flex items-center gap-3">
                        <img src={data.logo} alt={data.schemeName} className="w-10 h-10 rounded-lg border border-[#333]" />
                        <div>
                            <h3 className="font-semibold text-base">{data.schemeName}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{data.amc} • {data.category}</p>
                        </div>
                    </div>
                    <button onClick={onClose}>
                        <X size={22} className="text-gray-400 hover:text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                            <input
                                type="number"
                                value={investment || ''}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setInvestment(val);
                                    if (val < 1000 && val > 0) setErrorMsg('Minimum ₹1,000');
                                    else if (val <= 0) setErrorMsg('Enter a valid amount');
                                    else setErrorMsg('');
                                }}
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl py-3.5 pl-10 pr-4 text-white focus:border-green-600 focus:ring-1 focus:ring-green-600/30"
                                placeholder="Enter amount"
                            />
                        </div>
                        <p className={`text-xs mt-1.5 ${errorMsg ? 'text-red-400' : 'text-gray-500'}`}>
                            {errorMsg || 'Minimum investment: ₹1,000'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-sm">
                        <div>
                            <p className="text-gray-400 text-xs">Latest NAV</p>
                            <p className="font-medium">₹{latestNav.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-xs">NAV Date</p>
                            <p className="font-medium">{formatNavDate(data.navHistory[0].navDate)}</p>
                        </div>
                    </div>

                    <div className="bg-[#1a1a1a] border border-[#222] rounded-xl p-4">
                        <p className="text-gray-400 text-xs">Estimated Units</p>
                        <p className="text-lg font-medium">{units.toFixed(3)}</p>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1.5 pt-2 border-t border-[#222]">
                        <p className="font-medium text-gray-300">Important:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Mutual fund investments are subject to market risk.</li>
                            <li>Read scheme documents carefully before investing.</li>
                            <li>Orders once placed cannot be cancelled.</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 bg-[#0a0a0a] border-t border-[#1e1e1e]">
                    <button
                        onClick={onProceed}
                        disabled={!!errorMsg || investment < 1000}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/30"
                    >
                        Proceed to Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
