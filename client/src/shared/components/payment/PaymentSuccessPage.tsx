import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, ArrowLeft, Wallet, ExternalLink, Crown, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { ROUTES } from "@shared/constants/routes";
import { VerifyPaymentApi } from "@shared/services/user/verify-payment-api";

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const [animated, setAnimated] = useState(false);
    const search = useSearch({ from: '/user/_payment/payment-success' }) as { session_id: string };
    const sessionId = search.session_id;

    const { data: verifyData, isLoading, isError } = useQuery({
        queryKey: ["verify-payment", sessionId],
        queryFn: () => VerifyPaymentApi(sessionId),
        enabled: !!sessionId,
        retry: 1,
    });

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const paymentInfo = verifyData?.data;
    const amount = paymentInfo?.amount ?? 0;
    const purpose = paymentInfo?.purpose ?? 'TOPUP';
    const isSubscription = purpose === 'SUBSCRIPTION';

    const format = (v: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(v);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] flex flex-col items-center justify-center p-6 space-y-4">
                <Loader2 className="w-8 h-8 text-[#00C853] animate-spin" />
                <p className="text-[10px] text-[#5a5f6e] uppercase tracking-[0.2em] animate-pulse">Verifying Transaction...</p>
            </div>
        );
    }

    if (isError || !sessionId) {
        return (
            <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] flex flex-col items-center justify-center p-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-sm font-bold uppercase">Verification Invalid</h1>
                    <p className="text-[11px] text-[#5a5f6e] max-w-[240px]">We couldn't verify this payment session. If you believe this is an error, please contact support.</p>
                </div>
                <button
                    onClick={() => navigate({ to: ROUTES.HOME })}
                    className="px-6 py-2 bg-[#111214] border border-[#1e2025] rounded text-[10px] font-bold uppercase tracking-widest"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] flex flex-col items-center justify-center px-6">
            <div className={`w-full max-w-[380px] space-y-6 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

                <div className="bg-[#111214] border border-[#1e2025] rounded-xl overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2025]">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg ${isSubscription ? 'bg-amber-500/10 border-amber-500/20' : 'bg-green-500/10 border-green-500/20'} border flex items-center justify-center`}>
                                {isSubscription ? <Crown className="w-4 h-4 text-amber-500" /> : <Check className="w-4 h-4 text-green-500" />}
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-tight">
                                    {isSubscription ? "Premium Activated" : "Payment Successful"}
                                </p>
                                <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest mt-0.5">ID: {sessionId.slice(-12).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 text-center border-b border-[#1e2025]">
                        <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest mb-1.5 font-medium">
                            {isSubscription ? "Tier Unlocked" : "Credited Amount"}
                        </p>
                        <h1 className={`text-2xl font-extrabold tracking-tight ${isSubscription ? 'text-amber-500' : 'text-[#e8eaed]'}`}>
                            {isSubscription ? "Premium Access" : format(amount)}
                        </h1>
                    </div>

                    <div className="p-5 space-y-3.5 bg-[#0b0c0e]/50">
                        {isSubscription ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-[#5a5f6e]">Plan Benefits</span>
                                    <span className="text-amber-500 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                                        <Sparkles className="w-3 h-3" />
                                        Advanced Ready
                                    </span>
                                </div>
                                <p className="text-[10px] text-[#5a5f6e] leading-relaxed">
                                    Your algorithmic trading terminal is now operational with full depth features and premium data pipes.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-[#5a5f6e]">Status Update</span>
                                    <span className="text-[#00C853] font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                                        <Wallet className="w-3 h-3" />
                                        Balance Updated
                                    </span>
                                </div>
                                <p className="text-[10px] text-[#5a5f6e] leading-relaxed">
                                    Funds have been successfully provisioned to your account margin and are immediately available for market orders.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2.5">
                    <button
                        onClick={() => navigate({ to: isSubscription ? ROUTES.HOME : ROUTES.USER.WALLET.ROOT })}
                        className={`w-full py-3 ${isSubscription ? 'bg-amber-500 hover:bg-amber-400 text-white' : 'bg-green-600 hover:bg-green-500 text-white'} active:scale-[0.99] transition-all text-[11px] font-black uppercase tracking-widest rounded-md flex items-center justify-center gap-2`}
                    >
                        {isSubscription ? "Go to Dashboard" : "Go to wallet"}
                        <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                        onClick={() => navigate({ to: ROUTES.HOME })}
                        className="w-full py-2.5 bg-[#111214] border border-[#1e2025] hover:bg-[#1e2025] text-[#c8cacd] text-[10px] font-bold uppercase tracking-widest rounded-md transition-all"
                    >
                        Dashboard Home
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4 pt-4 border-t border-[#1e2025]/50">
                    <p className="text-[10px] text-[#3a3d45] text-center px-8 leading-relaxed italic">
                        Node Confirmation: A high-integrity receipt has been dispatched to your primary secure mailbox.
                    </p>
                    <button
                        onClick={() => navigate({ to: ROUTES.HOME })}
                        className="flex items-center gap-2 text-[10px] text-[#5a5f6e] hover:text-[#c8cacd] transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Platform Navigation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
