
import type { FundDetails } from '../../types/details.types';
import { Loader2, X } from 'lucide-react';

interface ConfirmModalProps {
    data: FundDetails;
    investment: number;
    units: number;
    latestNav: number;
    isSubmitting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmModal = ({
    data,
    investment,
    units,
    latestNav,
    isSubmitting,
    onClose,
    onConfirm,
}: ConfirmModalProps) => {
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-[360px] bg-[#0b0c0e] border border-[#1e2025] rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between bg-[#00C853]">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black text-white uppercase tracking-widest">Confirm Order</span>
                    </div>
                    <button onClick={onClose} disabled={isSubmitting} className="text-black/60 hover:text-black transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 text-center">
                    <div className="mb-6">
                        <p className="text-[10px] text-[#5a5f6e] font-bold uppercase tracking-[0.2em] mb-2">Total Payable</p>
                        <p className="text-4xl font-black text-white tracking-tighter">₹{investment.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-3">
                            <p className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-1">Est. Units</p>
                            <p className="text-[12px] text-white font-black">{units.toFixed(4)}</p>
                        </div>
                        <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-3">
                            <p className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider mb-1">Price/Unit</p>
                            <p className="text-[12px] text-white font-black">₹{latestNav.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-left">
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">Order Terms</p>
                        <ul className="space-y-1.5">
                            {['Order cannot be cancelled after confirmation', 'Amount will be deducted from your wallet', 'Market risks apply to MF investments'].map((item, i) => (
                                <li key={i} className="flex gap-2 text-[10px] text-[#5a5f6e] font-bold uppercase tracking-tight">
                                    <span className="text-amber-500">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="px-5 py-4 bg-[#111214] border-t border-[#1e2025]">
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-[#00C853] hover:bg-[#00E676] disabled:opacity-30 text-black text-[11px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-green-500/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `PLACE ORDER`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
