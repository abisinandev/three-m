import { useState } from 'react';
import { X, Loader2, Check, Crown } from 'lucide-react';
import { usePremiumPlan } from '@/shared/services/admin/subscription/SubscriptionApi';
import { toast } from 'sonner';
import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";

interface PremiumPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FEATURE_LABELS: Record<string, string> = {
    PORTFOLIO_BASIC: 'Basic Portfolio',
    MF_ONE_TIME: 'Mutual Funds (One-time)',
    MARKET_NEWS: 'Market News',
    CHATBOT_BASIC: 'Basic AI Chat',
    EXPENSE_TRACKING: 'Expense Tracking',
    STOCK_TRADING: 'Stock Trading',
    ALGO_TRADING: 'Algo Trading',
    TRADE_EXECUTION_BOT: 'Execution Bot',
    SIP_AUTOMATION: 'SIP Automation',
    AI_CHAT_ADVANCED: 'Advanced AI Chat',
    PORTFOLIO_ANALYTICS: 'Portfolio Analytics',
};

const FREE_FEATURES = [
    'Basic Portfolio',
    'Mutual Funds (One-time)',
    'Market News',
    'Basic AI Chat',
    'Expense Tracking',
];

const PremiumPaymentModal = ({ isOpen, onClose }: PremiumPaymentModalProps) => {
    const { data: plan, isLoading: isPlanLoading } = usePremiumPlan();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const premiumFeatures: string[] = plan?.features?.map(
        id => FEATURE_LABELS[id] || id.toLowerCase().replace(/_/g, ' ')
    ) ?? [];

    const duration =
        plan?.durationInDays === 30 ? 'month' :
        plan?.durationInDays === 365 ? 'year' :
        `${plan?.durationInDays} days`;

    const handleUpgrade = async () => {
        if (!plan?.price || loading) return;

        setLoading(true);
        const toastId = toast.loading('Initiating secure payment...');

        try {
            localStorage.setItem('paymentPurpose', 'SUBSCRIPTION');
            const res = await api.post(API_ROUTES.USER.PAYMENT.CHECKOUT_SESSION, {
                amount: Number(plan.price),
                purpose: "SUBSCRIPTION",
            });

            if (res.data.checkoutUrl) {
                window.location.href = res.data.checkoutUrl;
            } else {
                throw new Error("Checkout URL not found");
            }
        } catch (err: any) {
            console.error("Payment error", err);
            toast.error(err.response?.data?.message || "Failed to initiate payment", { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-[560px] bg-[#0b0c0e] border border-[#1e2025] rounded-xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2025]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Crown className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#e8eaed] leading-tight">Choose your plan</p>
                            <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest mt-0.5">threeM · Invest smarter</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#5a5f6e] hover:text-[#e8eaed] transition-colors p-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    {isPlanLoading ? (
                        <div className="py-12 flex flex-col items-center gap-3">
                            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                            <p className="text-xs text-[#5a5f6e]">Loading plan details…</p>
                        </div>
                    ) : (
                        <>
                            {/* Plans grid */}
                            <div className="grid grid-cols-2 gap-2.5 mb-4">

                                {/* Free plan */}
                                <div className="bg-[#111214] border border-[#1e2025] rounded-lg p-3.5">
                                    <p className="text-[10px] font-bold text-[#5a5f6e] uppercase tracking-widest mb-1">Free</p>
                                    <div className="flex items-baseline gap-1 mb-3">
                                        <span className="text-xl font-extrabold text-[#9ca3af] tracking-tight">₹0</span>
                                        <span className="text-[10px] text-[#5a5f6e]">/ forever</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        {FREE_FEATURES.map(f => (
                                            <div key={f} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#2a2d35] shrink-0" />
                                                <span className="text-[11px] text-[#5a5f6e]">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Premium plan */}
                                <div className="relative bg-amber-500/[0.05] border border-amber-500/30 rounded-lg p-3.5">
                                    <div className="absolute -top-px right-3 px-2 py-0.5 bg-amber-500 rounded-b text-[8px] font-black uppercase tracking-widest text-black">
                                        Best
                                    </div>
                                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Premium</p>
                                    <div className="flex items-baseline gap-1 mb-3">
                                        <span className="text-xl font-extrabold text-[#e8eaed] tracking-tight">₹{plan?.price ?? '—'}</span>
                                        <span className="text-[10px] text-[#5a5f6e]">/ {duration}</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        {premiumFeatures.map(f => (
                                            <div key={f} className="flex items-center gap-2">
                                                <Check className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                                                <span className="text-[11px] text-[#c8cacd]">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[#1e2025] my-4" />

                            {/* CTA */}
                            <div className="flex flex-col gap-2.5">
                                <div className="flex items-center justify-between bg-[#111214] border border-[#1e2025] rounded-md px-3 py-2.5">
                                    <span className="text-[11px] text-[#5a5f6e]">Due today</span>
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-[#e8eaed]">
                                        ₹{plan?.price ?? '—'}
                                        <span className="text-[10px] text-[#5a5f6e] font-normal">incl. taxes</span>
                                    </span>
                                </div>

                                <button
                                    onClick={handleUpgrade}
                                    disabled={loading || !plan?.price}
                                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] transition-all text-black text-xs font-black uppercase tracking-widest rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {loading ? "Processing..." : "Upgrade to Premium"}
                                </button>

                                <p className="text-[10px] text-[#3a3d45] text-center">
                                    Instant activation · Cancel anytime · 24/7 Priority support
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
