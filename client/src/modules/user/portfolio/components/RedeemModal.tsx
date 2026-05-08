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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-[360px] bg-[#0b0c0e] border border-[#1e2025] rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-green-600">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black text-white uppercase tracking-widest">Redeem Fund</span>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {confirmStep === 'success' ? (
                    <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-[#00C853]/10 rounded-full flex items-center justify-center mb-5 border border-[#00C853]/20">
                            <CheckCircle2 size={24} className="text-[#00C853]" />
                        </div>
                        <h3 className="text-[16px] font-black text-white mb-2 uppercase tracking-tight">Request Received</h3>
                        <p className="text-[11px] text-[#5a5f6e] leading-relaxed max-w-[240px] font-medium">
                            Your request to redeem <span className="text-white font-bold">{formatCurrency(estimatedValue)}</span> from {fund.schemeName} has been initiated.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full mt-8 py-3.5 bg-[#00C853] hover:bg-[#00E676] text-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-green-500/10"
                        >
                            Back to Portfolio
                        </button>
                    </div>
                ) : (
                    <div className="p-5">
                        {/* Summary Box */}
                        <div className="p-4 mb-5 bg-[#111214] border border-[#1e2025] rounded-xl">
                            <p className="text-[9px] font-bold text-[#5a5f6e] uppercase tracking-widest mb-1.5 line-clamp-1">
                                {fund.schemeName}
                            </p>
                            <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(fund.currentValue)}</p>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1e2025]">
                                <span className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-wider">Current NAV</span>
                                <span className="text-[11px] text-white font-black">₹{fund.nav.toFixed(4)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-5">
                            {(['full', 'partial'] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setRedeemType(t)}
                                    className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${redeemType === t
                                            ? 'bg-[#111214] border-[#1e2025] text-white'
                                            : 'bg-transparent border-transparent text-[#5a5f6e] hover:text-[#e8eaed]'
                                        }`}
                                >
                                    {t} REDEEM
                                </button>
                            ))}
                        </div>

                        {redeemType === 'partial' && (
                            <div className="mb-5 space-y-3">
                                <div className="flex gap-4 border-b border-[#1e2025] pb-2">
                                    {(['amount', 'units'] as const).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setRedeemMode(m)}
                                            className={`text-[9px] font-bold transition-all border-b-2 uppercase tracking-wider ${redeemMode === m
                                                    ? 'text-[#00C853] border-[#00C853]'
                                                    : 'text-[#5a5f6e] border-transparent hover:text-[#e8eaed]'
                                                }`}
                                        >
                                            BY {m}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative">
                                    <input
                                        type="number"
                                        value={redeemMode === 'amount' ? redeemAmount : redeemUnits}
                                        onChange={(e) => redeemMode === 'amount' ? setRedeemAmount(e.target.value) : setRedeemUnits(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full h-11 bg-[#111214] border border-[#1e2025] rounded-xl px-4 text-[13px] font-black text-white focus:outline-none focus:border-[#00C853] transition-all placeholder:text-[#333]"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#5a5f6e] uppercase tracking-wider">
                                        {redeemMode === 'amount' ? 'INR' : 'UNITS'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2.5 p-3 mb-6 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                            <AlertCircle size={12} className="text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-[9px] text-[#5a5f6e] font-bold leading-relaxed uppercase tracking-tight">
                                NAV depends on processing time (next business day).
                            </p>
                        </div>

                        <button
                            onClick={onConfirm}
                            disabled={!isValid || confirmStep === 'processing'}
                            className="w-full py-3.5 bg-green-600 hover:bg-green-500 disabled:opacity-30 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-500/10 flex items-center justify-center gap-2"
                        >
                            {confirmStep === 'processing' ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>Confirm Redemption</span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
