
import type { FundDetails } from '@modules/user/types/mutual-fund/details.types';
import { XCircle, X } from 'lucide-react';

interface FailedModalProps {
    data: FundDetails;
    onClose: () => void;
    error?: string;
}

export const FailedModal = ({ data, onClose, error }: FailedModalProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />
            <div className="relative w-full max-w-[320px] bg-[#0b0c0e] border border-[#1e2025] rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2025]">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <XCircle className="w-2.5 h-2.5 text-red-500" />
                        </div>
                        <span className="text-[11px] font-bold text-[#e8eaed] uppercase tracking-widest">Failed</span>
                    </div>
                    <button onClick={onClose} className="text-[#5a5f6e] hover:text-[#e8eaed] transition-colors p-1">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
                
                <div className="p-5 text-center">
                    <div className="mb-4">
                        <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest mb-1">Transaction Failed</p>
                        <p className="text-[11px] text-[#e8eaed] font-medium leading-relaxed px-2">
                            {error || "Your investment could not be processed."}
                        </p>
                    </div>
                    
                    <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-3 mb-5">
                        <p className="text-[10px] text-[#5a5f6e] mb-1 text-left">Fund Scheme</p>
                        <p className="text-[11px] text-[#c8cacd] leading-normal font-medium text-left line-clamp-2">{data.schemeName}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-[#1e2025] hover:bg-[#2a2d35] active:scale-[0.99] transition-all text-[#e8eaed] text-[10px] font-black uppercase tracking-widest rounded-md border border-[#2a2d35]"
                    >
                        Try Again
                    </button>
                    
                    <p className="text-[9px] text-[#3a3d45] mt-4 leading-relaxed px-4">
                        Common reasons include insufficient funds or network issues. Please check your account.
                    </p>
                </div>
            </div>
        </div>
    );
};
