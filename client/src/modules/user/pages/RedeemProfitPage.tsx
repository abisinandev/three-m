import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { getRedeemableInvestments } from '@shared/services/feature/portfolio/PortfolioApi';
import type { IRedeemedInvestment } from '@shared/types/portfolio.types';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@lib/axiosUser';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const RedeemFundsPage = () => {
    const navigate = useNavigate();

    const { data: investments = [], isLoading: loading, refetch } = useQuery<IRedeemedInvestment[]>({
        queryKey: ['redeemable-investments'],
        queryFn: getRedeemableInvestments,
        staleTime: 5 * 60 * 1000,
    });

    // Modal State
    const [selectedFund, setSelectedFund] = useState<IRedeemedInvestment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [redeemType, setRedeemType] = useState<'full' | 'partial'>('full');
    const [redeemAmount, setRedeemAmount] = useState('');
    const [redeemUnits, setRedeemUnits] = useState('');
    const [confirmStep, setConfirmStep] = useState<'input' | 'processing' | 'success' | 'error'>('input');
    const [redeemMode, setRedeemMode] = useState<'amount' | 'units'>('amount');

    const openRedeemModal = (fund: IRedeemedInvestment) => {
        setSelectedFund(fund);
        setRedeemType('full');
        setConfirmStep('input');
        setRedeemAmount('');
        setRedeemUnits('');
        setIsModalOpen(true);
    };

    const closeRedeemModal = () => {
        setIsModalOpen(false);
        setSelectedFund(null);
    };

    const mutateRedeem = useMutation({
        mutationFn: async (payload: { schemeCode: string, amount: number | string, units: number | string }) =>
            await api.patch("/user/portfolio/confirm-redeem", payload),

        onSuccess: (res) => {
            console.log("Redemption Successful:", res.data);
            setConfirmStep('success');
            refetch();
        },

        onError: (err) => {
            console.error("Redemption Error:", err);
            setConfirmStep('input');
        },
    });

    const handleRedeemConfirm = async () => {
        if (!selectedFund) return;
        setConfirmStep('processing');

        mutateRedeem.mutate({
            schemeCode: selectedFund.schemeCode,
            amount: redeemType === 'full' ? selectedFund.currentValue : redeemAmount,
            units: redeemType === 'full' ? selectedFund.totalUnits : redeemUnits,
        });
    };

    const estimatedRedeemValue = useMemo(() => {
        if (!selectedFund) return 0;
        if (redeemType === 'full') return selectedFund.currentValue;

        if (redeemMode === 'amount') {
            return Number(redeemAmount) || 0;
        } else {
            return (Number(redeemUnits) * selectedFund.nav) || 0;
        }
    }, [selectedFund, redeemType, redeemMode, redeemAmount, redeemUnits]);

    const isValidRedemption = useMemo(() => {
        if (!selectedFund) return false;
        if (redeemType === 'full') return true;

        if (redeemMode === 'amount') {
            const amt = Number(redeemAmount);
            return amt > 0 && amt <= selectedFund.currentValue;
        } else {
            const units = Number(redeemUnits);
            return units > 0 && units <= selectedFund.totalUnits;
        }
    }, [selectedFund, redeemType, redeemMode, redeemAmount, redeemUnits]);

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <div className="sticky top-0 z-10 border-b border-zinc-900 bg-black/90 backdrop-blur px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate({ to: "/user/portfolio" })}
                    className="p-2 -ml-2 hover:bg-zinc-900 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-zinc-400" />
                </button>
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Redeem Holdings</h1>
                    <p className="text-xs text-zinc-500">Select a fund to withdraw from</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center py-20 text-sm text-zinc-500">Loading portfolio...</div>
                ) : investments.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-zinc-500">No active investments found to redeem.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {investments.map((fund) => (
                            <div key={fund.schemeCode} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                                            {fund.logo ? <img src={fund.logo} className="w-6 h-6 object-contain" /> : <span className="text-xs font-bold text-zinc-500">{fund.schemeName.slice(0, 2)}</span>}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-zinc-200 line-clamp-1" title={fund.schemeName}>{fund.schemeName}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50 uppercase tracking-wide">{fund.category}</span>
                                                <span className="text-xs text-zinc-500">• {fund.totalUnits.toFixed(3)} units</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                                        <div className="text-right">
                                            <p className="text-xs text-zinc-500 mb-0.5">Current Value</p>
                                            <p className="font-semibold text-zinc-200">{formatCurrency(fund.currentValue)}</p>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-zinc-500 mb-0.5">Returns</p>
                                            <p className={`font-medium text-sm ${fund.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {fund.profit >= 0 ? '+' : ''}{formatCurrency(fund.profit)}
                                                <span className="text-xs ml-1 opacity-80">({fund.roi.toFixed(2)}%)</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => openRedeemModal(fund)}
                                            className="bg-zinc-100 hover:bg-white text-black text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
                                        >
                                            Redeem
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && selectedFund && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeRedeemModal} />

                    <div className="relative bg-[#09090b] border border-zinc-800 w-full max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
                            <h2 className="font-semibold text-zinc-200">Redeem Investment</h2>
                            <button onClick={closeRedeemModal} className="p-1 hover:bg-zinc-800 rounded-full text-zinc-400"><X size={18} /></button>
                        </div>

                        {confirmStep === 'success' ? (
                            <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 size={32} className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Redemption Initiated</h3>
                                <p className="text-sm text-zinc-400 max-w-xs">
                                    Your request to redeem <span className="text-white font-medium">{formatCurrency(estimatedRedeemValue)}</span> from {selectedFund.schemeName} has been received.
                                </p>
                                <button onClick={closeRedeemModal} className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors">
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 overflow-y-auto">
                                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 mb-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-zinc-500 mb-1">{selectedFund.schemeName}</p>
                                            <p className="text-xl font-bold tracking-tight text-white">{formatCurrency(selectedFund.currentValue)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-zinc-500 mb-1">NAV</p>
                                            <p className="text-sm font-medium text-zinc-300">₹{selectedFund.nav.toFixed(4)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Redemption Type</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setRedeemType('full')}
                                                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${redeemType === 'full' ? 'bg-zinc-700 text-white border-transparent' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'}`}
                                            >
                                                Full Redeem
                                            </button>
                                            <button
                                                onClick={() => setRedeemType('partial')}
                                                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${redeemType === 'partial' ? 'bg-zinc-700 text-black border-transparent' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'}`}
                                            >
                                                Partial Redeem
                                            </button>
                                        </div>
                                    </div>

                                    {redeemType === 'partial' && (
                                        <div className="space-y-4 mb-6 animate-in slide-in-from-top-2 fade-in duration-200">
                                            <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 mb-2">
                                                <button onClick={() => setRedeemMode('amount')} className={`pb-1 border-b-2 transition-colors ${redeemMode === 'amount' ? 'text-white border-white' : 'border-transparent hover:text-zinc-300'}`}>By Amount</button>
                                                <button onClick={() => setRedeemMode('units')} className={`pb-1 border-b-2 transition-colors ${redeemMode === 'units' ? 'text-white border-white' : 'border-transparent hover:text-zinc-300'}`}>By Units</button>
                                            </div>

                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={redeemMode === 'amount' ? redeemAmount : redeemUnits}
                                                    onChange={(e) => redeemMode === 'amount' ? setRedeemAmount(e.target.value) : setRedeemUnits(e.target.value)}
                                                    placeholder={redeemMode === 'amount' ? "Enter amount" : "Enter units"}
                                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-lg font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                                                    {redeemMode === 'amount' ? 'INR' : 'Units'}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                                                <AlertCircle size={12} />
                                                Units will be redeemed using First-In-First-Out (FIFO) method.
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 flex gap-3">
                                        <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-xs text-blue-200">Final amount depends on NAV</p>
                                            <p className="text-[10px] text-blue-300/60 leading-relaxed">
                                                The actual amount credited may vary slightly based on the NAV at the time of processing (usually next business day for equity funds).
                                            </p>
                                        </div>
                                    </div>

                                    {estimatedRedeemValue > 0 && estimatedRedeemValue < 100 && (
                                        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-3">
                                            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="text-xs text-red-200">Minimum Redemption Amount</p>
                                                <p className="text-[10px] text-red-300/60 leading-relaxed">
                                                    The minimum amount you can redeem is ₹100. Please increase your redemption value.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 pt-2">
                                    <button
                                        onClick={handleRedeemConfirm}
                                        disabled={!isValidRedemption || confirmStep === 'processing'}
                                        className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {confirmStep === 'processing' ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-800 rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            `Confirm Redeem ${formatCurrency(estimatedRedeemValue)}`
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RedeemFundsPage;
