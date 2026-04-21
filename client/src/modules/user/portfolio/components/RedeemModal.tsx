import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import type { IRedeemedInvestment } from '@shared/types/portfolio.types';

interface RedeemModalProps {
    fund: IRedeemedInvestment;
    onClose: () => void;
    redeemType: 'full' | 'partial';
    setRedeemType: (t: 'full' | 'partial') => void;
    redeemMode: 'amount' | 'units';
    setRedeemMode: (m: 'amount' | 'units') => void;
    redeemAmount: string;
    setRedeemAmount: (a: string) => void;
    redeemUnits: string;
    setRedeemUnits: (u: string) => void;
    confirmStep: 'input' | 'processing' | 'success' | 'error';
    onConfirm: () => void;
    estimatedValue: number;
    isValid: boolean;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

export const RedeemModal = ({
    fund, onClose, 
    redeemType, setRedeemType,
    redeemMode, setRedeemMode,
    redeemAmount, setRedeemAmount,
    redeemUnits, setRedeemUnits,
    confirmStep, onConfirm,
    estimatedValue, isValid
}: RedeemModalProps) => {
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/70  animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/50">
                    <h2 className="text-sm font-bold text-neutral-200">Redeem Investment</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {confirmStep === 'success' ? (
                    <div className="p-10 text-center flex flex-col items-center">
                        <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-5 border border-green-500/20">
                            <CheckCircle2 size={28} className="text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Request Received</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed max-w-[260px]">
                            Your request to redeem <span className="text-neutral-200 font-bold">{formatCurrency(estimatedValue)}</span> from {fund.schemeName} has been initiated.
                        </p>
                        <button 
                            onClick={onClose} 
                            className="w-full mt-8 py-3 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-green-900/20"
                        >
                            Got it
                        </button>
                    </div>
                ) : (
                    <div className="p-6">
                        {/* Summary Box */}
                        <div className="p-4 mb-6 bg-black/40 border border-neutral-800 rounded-lg">
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-1.5">
                                {fund.schemeName}
                            </p>
                            <p className="text-2xl font-black text-neutral-100">{formatCurrency(fund.currentValue)}</p>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-800/50">
                                <span className="text-[10px] text-neutral-500 font-semibold uppercase">Current NAV</span>
                                <span className="text-[11px] text-neutral-200 font-bold">₹{fund.nav.toFixed(4)}</span>
                            </div>
                        </div>

                        {/* Selection Tabs */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {(['full', 'partial'] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setRedeemType(t)}
                                    className={`py-2.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all border ${
                                        redeemType === t 
                                        ? 'bg-neutral-800 border-neutral-700 text-neutral-100 shadow-inner' 
                                        : 'bg-transparent border-neutral-800 text-neutral-500 hover:text-neutral-400'
                                    }`}
                                >
                                    {t} REDEEM
                                </button>
                            ))}
                        </div>

                        {/* Partial Controls */}
                        {redeemType === 'partial' && (
                            <div className="mb-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex gap-4 border-b border-neutral-800/50 pb-1">
                                    {(['amount', 'units'] as const).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setRedeemMode(m)}
                                            className={`text-[10px] font-bold pb-1 transition-all border-b-2 ${
                                                redeemMode === m 
                                                ? 'text-green-500 border-green-500' 
                                                : 'text-neutral-500 border-transparent hover:text-neutral-300 font-semibold'
                                            }`}
                                        >
                                            BY {m.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={redeemMode === 'amount' ? redeemAmount : redeemUnits}
                                        onChange={(e) => redeemMode === 'amount' ? setRedeemAmount(e.target.value) : setRedeemUnits(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full h-12 bg-black/50 border border-neutral-800 rounded-lg px-4 text-base font-black text-neutral-100 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder:text-neutral-700 appearance-none"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-neutral-500 uppercase tracking-tighter pointer-events-none">
                                        {redeemMode === 'amount' ? 'INR' : 'UNITS'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Info Banner */}
                        <div className="flex gap-3 p-3 mb-8 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                            <AlertCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                                The final amount depends on the NAV at processing time (usually next business day for mutual funds).
                            </p>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={onConfirm}
                            disabled={!isValid || confirmStep === 'processing'}
                            className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white text-xs font-bold rounded-lg transition-all active:scale-[0.99] shadow-lg shadow-green-950/20 flex items-center justify-center gap-3"
                        >
                            {confirmStep === 'processing' ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>Confirm & Redeem {formatCurrency(estimatedValue)}</span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
