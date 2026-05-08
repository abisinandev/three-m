import type { FundDetails } from '../../types/details.types';
import { formatNavDate } from '@/utils/mutualFundUtils/mutual-fund.chart';
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
    onClose,
    onProceed,
}: InvestModalProps) => {

    const isValid = investment >= 1000 && !errorMsg;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/80"
                onClick={onClose}
            />

            <div className="relative bg-[#0b0c0e] text-[#e8eaed] rounded-2xl shadow-2xl w-full max-w-[340px] overflow-hidden border border-[#1e2025]">

                <div className="px-5 py-4 flex items-center justify-between bg-[#00C853]">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black text-white uppercase tracking-widest">
                            Invest in Fund
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-5 py-3 bg-[#111214] border-b border-[#1e2025] flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider">NAV</span>
                        <span className="text-[11px] font-bold text-white">₹{latestNav.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider">Date</span>
                        <span className="text-[11px] font-bold text-white uppercase">{formatNavDate(data.navHistory[0].navDate)}</span>
                    </div>
                </div>

                <div className="p-5 space-y-6">
                    <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-3">
                        <p className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-1.5">Fund Name</p>
                        <p className="text-[11px] text-white font-bold leading-tight line-clamp-2">{data.schemeName}</p>
                    </div>

                    <div>
                        <label className="block text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-2.5">Investment Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5f6e] font-bold text-[12px]">₹</span>
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
                                className={`w-full bg-[#111214] border rounded-xl py-2.5 pl-8 pr-3 text-[13px] text-white focus:outline-none font-black transition-all ${errorMsg ? 'border-red-500/50 focus:border-red-500' : 'border-[#1e2025] focus:border-[#00C853]'}`}
                                placeholder="1000"
                            />
                        </div>
                        {errorMsg && (
                            <p className="text-[9px] text-red-500 mt-1.5 font-bold uppercase tracking-tight">{errorMsg}</p>
                        )}
                    </div>

                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                        <div className="flex gap-2">
                            <Info size={12} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">
                                Mutual fund investments are subject to market risks. Read all scheme related documents carefully.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-4 bg-[#111214] border-t border-[#1e2025]">
                    <button
                        onClick={onProceed}
                        disabled={!isValid}
                        className="w-full py-3.5 bg-[#00C853] hover:bg-[#00E676] active:scale-[0.98] transition-all text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-green-500/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        PROCEED TO INVEST
                    </button>
                </div>
            </div>
        </div>
    );
};
