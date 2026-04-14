
import type { FundDetails } from '@modules/user/types/MutaulFundType';
import { Check, X } from 'lucide-react';

interface SuccessModalProps {
    data: FundDetails;
    investment: number;
    onClose: () => void;
}

export const SuccessModal = ({ data, investment, onClose }: SuccessModalProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />
            <div className="relative w-full max-w-[320px] bg-[#0b0c0e] border border-[#1e2025] rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2025]">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-green-500" />
                        </div>
                        <span className="text-[11px] font-bold text-[#e8eaed] uppercase tracking-widest">Success</span>
                    </div>
                    <button onClick={onClose} className="text-[#5a5f6e] hover:text-[#e8eaed] transition-colors p-1">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
                
                <div className="p-5 text-center">
                    <div className="mb-4">
                        <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest mb-1">Investment Confirmed</p>
                        <p className="text-lg font-extrabold text-[#e8eaed] tracking-tight">₹{investment.toLocaleString('en-IN')}</p>
                    </div>
                    
                    <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-3 mb-5">
                        <p className="text-[10px] text-[#5a5f6e] mb-1 text-left">Fund Scheme</p>
                        <p className="text-[11px] text-[#c8cacd] leading-normal font-medium text-left line-clamp-2">{data.schemeName}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] transition-all text-black text-[10px] font-black uppercase tracking-widest rounded-md"
                    >
                        Done
                    </button>
                    
                    <p className="text-[9px] text-[#3a3d45] mt-4 leading-relaxed">
                        Your investment will be processed within 1-2 working days. You can track this in your history.
                    </p>
                </div>
            </div>
        </div>
    );
};
