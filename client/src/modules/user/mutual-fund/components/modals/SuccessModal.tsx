import type { FundDetails } from '../../types/details.types';
import { Check, X } from 'lucide-react';

interface SuccessModalProps {
    data: FundDetails;
    investment: number;
    successData?: { amount?: number; units?: number };
    onClose: () => void;
}

export const SuccessModal = ({ data, investment, successData, onClose }: SuccessModalProps) => {
    const displayAmount = successData?.amount || investment;
    const units = successData?.units || (successData?.amount && data.navHistory?.[0]?.nav ? successData.amount / data.navHistory[0].nav : 0);

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-[340px] bg-[#0b0c0e] border border-[#1e2025] rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-[#00C853]">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black text-black uppercase tracking-widest">Investment Success</span>
                    </div>
                    <button onClick={onClose} className="text-black/60 hover:text-black transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-5">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-[#00C853]/10 rounded-full flex items-center justify-center border-2 border-[#00C853]/20">
                            <Check size={32} className="text-[#00C853]" strokeWidth={3} />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-[10px] text-[#5a5f6e] font-black uppercase tracking-[0.2em] mb-2">Total Amount Invested</p>
                        <p className="text-3xl font-black text-white tracking-tighter">₹{displayAmount.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-3">
                            <p className="text-[9px] text-[#5a5f6e] font-black uppercase tracking-widest mb-1.5">Fund Details</p>
                            <p className="text-[11px] text-white leading-relaxed font-black uppercase line-clamp-2">{data.schemeName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-3 text-center">
                                <p className="text-[9px] text-[#5a5f6e] font-black uppercase tracking-widest mb-1">Units</p>
                                <p className="text-[12px] text-white font-black">{units > 0 ? units.toFixed(4) : 'Pending'}</p>
                            </div>
                            <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-3 text-center">
                                <p className="text-[9px] text-[#5a5f6e] font-black uppercase tracking-widest mb-1">Applied NAV</p>
                                <p className="text-[12px] text-white font-black">₹{data.navHistory?.[0]?.nav || 'Market'}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-[#00C853] hover:bg-[#00E676] text-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-green-500/10"
                    >
                        Back to Portfolio
                    </button>

                    <div className="mt-5 p-3.5 bg-[#111214] border border-[#1e2025] rounded-xl">
                        <p className="text-[9px] text-[#5a5f6e] leading-relaxed text-center font-bold uppercase tracking-tight">
                            Note: Units will be allocated within 1-2 working days after AMC verification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
