import type { FundDetails } from '@modules/user/types/mutual-fund/details.types';
import { formatNavDate } from '@shared/utils/mutual-fund.utils';
import { X, Info, Loader2 } from 'lucide-react';

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

    const themeBg = 'bg-[#00C853]';
    const textColor = 'text-[#00C853]';

    const isValid = investment >= 1000 && !errorMsg;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div 
                className="fixed inset-0 bg-black/80"
                onClick={onClose}
            />

            <div className="relative bg-[#0f0f0f] text-gray-100 rounded-[10px] shadow-2xl w-full max-w-md overflow-hidden font-sans border border-[#1f1f1f]">
                
                {/* Header Banner */}
                <div className={`${themeBg} px-5 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm tracking-wide">
                            INVEST IN {data.schemeName.toUpperCase()} 
                        </span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Secondary Info Band */}
                <div className="px-5 py-3 border-b border-[#1f1f1f] bg-[#161616] flex justify-between items-center text-[11px] font-medium text-gray-400">
                    <div className="flex gap-4">
                        <span>NAV: <span className="text-gray-100">₹{latestNav.toFixed(2)}</span></span>
                        <span>AS ON: <span className="text-gray-100 uppercase">{formatNavDate(data.navHistory[0].navDate)}</span></span>
                    </div>
                </div>

                <div className="p-5 space-y-6">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wider">Amount (₹)</label>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
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
                                className={`w-full bg-[#1a1a1a] border rounded-[4px] py-2 pl-8 pr-3 text-sm text-white focus:outline-none font-medium placeholder:text-gray-600 ${errorMsg ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#00C853]'}`}
                                placeholder="1000"
                            />
                        </div>
                        {errorMsg && (
                            <p className="text-[10px] text-red-500 mt-1.5 font-medium">{errorMsg}</p>
                        )}
                        {!errorMsg && (
                            <p className="text-[10px] text-gray-500 mt-1.5 font-medium">Minimum investment: ₹1,000</p>
                        )}
                    </div>

                    <div className="pt-2 border-t border-[#1f1f1f]">
                        <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-3">Notice</label>
                        <div className="text-[10px] text-gray-400 space-y-1.5">
                            <div className="flex gap-2">
                                <div className="mt-0.5"><Info size={10} className="text-gray-500" /></div>
                                <span>Mutual fund investments are subject to market risks.</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="mt-0.5"><Info size={10} className="text-gray-500" /></div>
                                <span>Read all scheme related documents carefully.</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="mt-0.5"><Info size={10} className="text-gray-500" /></div>
                                <span>Orders once placed cannot be cancelled.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-[#161616] flex items-center justify-between border-t border-[#1f1f1f]">
                    <div className="space-y-0.5">
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Est. Units:</p>
                        <p className={`text-sm font-bold text-gray-100`}>
                            {units > 0 ? units.toFixed(4) : "0.0000"}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onProceed}
                            disabled={!isValid}
                            className={`px-8 py-2 min-w-[120px] rounded-[4px] text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 ${themeBg} hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                            PROCEED
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
