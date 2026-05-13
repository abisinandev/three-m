import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { usePremiumPlan } from '@/shared/services/admin/subscription/subscription-api';
import { toast } from 'sonner';
import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";

import { FEATURE_LABELS, FREE_FEATURES } from './types/constants';
import { PlanCard, ModalHeader } from './components';
import type { PremiumPaymentModalProps } from './types/types';

const PremiumPaymentModal = ({ isOpen, onClose }: PremiumPaymentModalProps) => {
    const { data: plan, isLoading: isPlanLoading } = usePremiumPlan();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const verify = async () => {
            const sessionId = new URLSearchParams(window.location.search)
                .get("session_id");

            if (!sessionId) return;

            try {
                await api.post("/payments/verify", { sessionId });

                // clear localStorage
                // localStorage.removeItem("paymentPurpose");
                // localStorage.removeItem("paymentAmount");

            } catch (err) {
                console.error("Verification failed", err);
            }
        };

        verify();
    }, []);


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
            // localStorage.setItem('paymentPurpose', 'SUBSCRIPTION');
            // localStorage.setItem('paymentAmount', String(plan.price));

            const res = await api.post(API_ROUTES.USER.PAYMENT.CHECKOUT_SESSION, {
                amount: Number(plan.price),
                purpose: "SUBSCRIPTION",
            });

            const checkoutUrl = res.data.data.checkoutUrl;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                throw new Error("Checkout URL not found");
            }
        } catch (err: unknown) {
            console.error("Payment error", err);
            toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to initiate payment", { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-[560px] bg-[#0b0c0e] border border-[#1e2025] rounded-xl overflow-hidden shadow-2xl">
                <ModalHeader onClose={onClose} />

                <div className="p-5">
                    {isPlanLoading ? (
                        <div className="py-12 flex flex-col items-center gap-3">
                            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                            <p className="text-xs text-[#5a5f6e]">Loading plan details…</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-2.5 mb-4">
                                <PlanCard
                                    name="Free"
                                    price="0"
                                    duration="forever"
                                    features={FREE_FEATURES}
                                />

                                <PlanCard
                                    isPremium
                                    best
                                    name="Premium"
                                    price={plan?.price ?? '—'}
                                    duration={duration}
                                    features={premiumFeatures}
                                />
                            </div>

                            <div className="h-px bg-[#1e2025] my-4" />

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

