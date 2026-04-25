import type { FundDetails } from '@modules/user/types/mutual-fund/details.types';
import { Check, X } from 'lucide-react';

interface SuccessModalProps {
    data: FundDetails;
    investment: number;
    successData?: any;
    onClose: () => void;
}

export const SuccessModal = ({ data, investment, successData, onClose }: SuccessModalProps) => {
    // Use values from successData if available, otherwise fallback to props/calculated values
    const displayAmount = successData?.amount || investment;
    const units = successData?.units || (successData?.amount && data.navHistory?.[0]?.nav ? successData.amount / data.navHistory[0].nav : 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />
            <div className="relative w-full max-w-[340px] bg-[#0b0c0e] border border-[#1e2025] rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2025]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-500" />
                        </div>
                        <span className="text-[12px] font-bold text-[#e8eaed] uppercase tracking-widest">Investment Successful</span>
                    </div>
                    <button onClick={onClose} className="text-[#5a5f6e] hover:text-[#e8eaed] transition-colors p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-[10px] text-[#5a5f6e] uppercase font-bold tracking-[0.2em] mb-2">Total Amount Invested</p>
                        <p className="text-3xl font-black text-white tracking-tighter">₹{displayAmount.toLocaleString('en-IN')}</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                        <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-4">
                            <p className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-2">Fund Details</p>
                            <p className="text-[12px] text-white leading-relaxed font-semibold line-clamp-2">{data.schemeName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-3">
                                <p className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-1">Units Allocated</p>
                                <p className="text-[13px] text-white font-mono font-bold">{units > 0 ? units.toFixed(4) : 'Pending'}</p>
                            </div>
                            <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-3">
                                <p className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-1">NAV Applied</p>
                                <p className="text-[13px] text-white font-mono font-bold">₹{data.navHistory?.[0]?.nav || 'Market'}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-[#00C853] hover:bg-[#00E676] active:scale-[0.98] transition-all text-black text-[11px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-green-500/10"
                    >
                        Go to Portfolio
                    </button>
                    
                    <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                        <p className="text-[10px] text-amber-500/80 leading-relaxed text-center font-medium">
                            The final NAV and units will be confirmed once the order is processed by the AMC (usually within 1-2 working days).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
