
import type { FundDetails } from '@modules/user/types/mutual-fund/details.types';
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] px-6 py-4 flex items-center justify-between border-b border-[#222]">
                    <h3 className="font-semibold text-base">Confirm Investment</h3>
                    <button onClick={onClose} disabled={isSubmitting}>
                        <X size={22} className="text-gray-400 hover:text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-6 text-center">
                    <div>
                        <p className="text-gray-400">You are investing</p>
                        <p className="text-4xl font-bold mt-2">₹{investment.toLocaleString('en-IN')}</p>
                        <p className="text-sm text-gray-400 mt-3">
                            ≈ {units.toFixed(3)} units @ ₹{latestNav.toFixed(2)}
                        </p>
                    </div>

                    <div className="text-xs text-gray-500 space-y-2 bg-[#1a1a1a] border border-[#222] rounded-xl p-4">
                        <p className="font-medium text-gray-300">Please note:</p>
                        <ul className="list-disc pl-4 space-y-1 text-left">
                            <li>Order cannot be cancelled after confirmation.</li>
                            <li>Amount will be deducted from your wallet.</li>
                            <li>Mutual fund investments are subject to market risks.</li>
                        </ul>
                    </div>
                </div>

                <div className="px-6 py-5 bg-[#0a0a0a] border-t border-[#1e1e1e]">
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Confirm & Invest ₹${investment.toLocaleString('en-IN')}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
