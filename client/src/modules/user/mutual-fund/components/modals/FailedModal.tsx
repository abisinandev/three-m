
import type { FundDetails } from '../../types/details.types';
import { XCircle, X } from 'lucide-react';

interface FailedModalProps {
    data: FundDetails;
    onClose: () => void;
    error?: string;
}

export const FailedModal = ({ data, onClose, error }: FailedModalProps) => {
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-[340px] bg-[#0b0c0e] border border-[#1e2025] rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-5 py-4 bg-[#FF1744]">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black text-white uppercase tracking-widest">Investment Failed</span>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-5 border border-red-500/20 mx-auto">
                        <XCircle className="w-6 h-6 text-red-500" />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-[16px] font-black text-white mb-2 uppercase tracking-tight">Oops! Something went wrong</h3>
                        <p className="text-[11px] text-[#5a5f6e] leading-relaxed font-medium">
                            {error || "Your investment could not be processed at this moment. Please check your wallet balance or try again later."}
                        </p>
                    </div>

                    <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-4 mb-6">
                        <p className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-widest mb-1.5 text-left">Fund Name</p>
                        <p className="text-[11px] text-[#e8eaed] leading-normal font-bold text-left line-clamp-2 uppercase">{data.schemeName}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-red-600 hover:bg-red-500 active:scale-[0.98] transition-all text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-red-500/10"
                    >
                        Try Again
                    </button>

                    <p className="text-[9px] text-[#3a3d45] mt-6 leading-relaxed uppercase tracking-widest font-black">
                        Error Code: 0xTRX_FAIL_01
                    </p>
                </div>
            </div>
        </div>
    );
};
