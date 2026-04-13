import React from 'react';
import { X, Sparkles, Check, Zap, ShieldCheck, Cpu, TrendingUp, LineChart, BarChart3, Loader2 } from 'lucide-react';
import { usePremiumPlan } from '@/shared/services/admin/subscription/SubscriptionApi';
import { toast } from 'sonner';

interface PremiumPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
    SIP_AUTOMATION: <TrendingUp className="w-3.5 h-3.5" />,
    STOCK_TRADING: <LineChart className="w-3.5 h-3.5" />,
    ALGO_TRADING: <Zap className="w-3.5 h-3.5 fill-emerald-500" />,
    TRADE_EXECUTION_BOT: <ShieldCheck className="w-3.5 h-3.5" />,
    AI_CHAT_ADVANCED: <Cpu className="w-3.5 h-3.5" />,
    PORTFOLIO_ANALYTICS: <BarChart3 className="w-3.5 h-3.5" />,
};

const PremiumPaymentModal = ({ isOpen, onClose }: PremiumPaymentModalProps) => {
    const { data: plan, isLoading } = usePremiumPlan();

    if (!isOpen) return null;

    const handleUpgrade = () => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: 'Initiating secure payment...',
            success: 'Upgrade successful! (Demo)',
            error: 'Payment failed.',
        });
        setTimeout(onClose, 2500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-[#0A0A0A] border border-emerald-500/20 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                {/* Visual Flair */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
                <div className="absolute -top-24 -right-24 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />

                <button onClick={onClose} className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors z-10">
                    <X className="w-4.5 h-4.5" />
                </button>

                <div className="p-7 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <Sparkles className="w-5 h-5 fill-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">threeM Premium</h2>
                            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-[0.2em]">Elevate your investment strategy</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            <p className="text-sm text-neutral-500">Fetching plan details...</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-[#111] border border-neutral-800/80 rounded-2xl p-5 mb-6 group transition-all hover:border-emerald-500/30">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-3xl font-bold text-white font-mono">₹{plan?.price}</span>
                                    <span className="text-neutral-500 text-xs">{plan?.durationInDays === 30 ? '/ month' : `/ ${plan?.durationInDays} days`}</span>
                                </div>
                                <p className="text-[10px] text-neutral-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Unlock pro trading features and AI assistants</p>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Included Features</h3>
                                    <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full font-bold">ALL ACCESS</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {plan?.features.map((featureId) => (
                                        <div key={featureId} className="flex items-center gap-2.5 p-2.5 bg-neutral-900/30 rounded-xl border border-neutral-800/30 hover:bg-neutral-800/50 transition-colors group/item">
                                            <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-emerald-500 group-hover/item:scale-105 transition-transform shrink-0">
                                                {FEATURE_ICONS[featureId] || <Check className="w-3.5 h-3.5" />}
                                            </div>
                                            <span className="text-[10px] font-bold text-neutral-300 capitalize truncate">{featureId.toLowerCase().replace(/_/g, ' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleUpgrade}
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                >
                                    Activate Premium
                                </button>
                                <p className="text-[9px] text-center text-neutral-600 leading-relaxed font-medium mx-auto max-w-[280px]">
                                    Instant activation • Cancel anytime • 24/7 Priority support
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PremiumPaymentModal;
