
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, ArrowLeft, Wallet, ExternalLink, Crown, Sparkles } from "lucide-react";
import { ROUTES } from "@shared/constants/routes";

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getNumber = (key: string) => {
        const value = localStorage.getItem(key);
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };

    const purpose = localStorage.getItem('paymentPurpose') || 'TOPUP';
    const isSubscription = purpose === 'SUBSCRIPTION';

    const newBalance = getNumber("newBalance");
    const addedAmount = getNumber("addedAmount");
    const previousBalance = getNumber("previousBalance");

    const format = (v: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(v);

    return (
        <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] flex flex-col items-center justify-center px-6">
            <div className={`w-full max-w-[380px] space-y-6 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                
                {/* Status Card */}
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
                                <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest mt-0.5">Reference: STRIPE_CONFIRMED</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 text-center border-b border-[#1e2025]">
                        <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest mb-1.5 font-medium">
                            {isSubscription ? "Plan Status" : "Amount Received"}
                        </p>
                        <h1 className={`text-2xl font-extrabold tracking-tight ${isSubscription ? 'text-amber-500' : 'text-[#e8eaed]'}`}>
                            {isSubscription ? "Premium Membership" : format(addedAmount)}
                        </h1>
                    </div>

                    <div className="p-5 space-y-3.5 bg-[#0b0c0e]/50">
                        {isSubscription ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-[#5a5f6e]">Access Status</span>
                                    <span className="text-amber-500 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                                        <Sparkles className="w-3 h-3" />
                                        Full Access
                                    </span>
                                </div>
                                <p className="text-[10px] text-[#5a5f6e] leading-relaxed">
                                    Welcome to threeM Premium. Your advanced trading features and AI insights are now unlocked and ready for use.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-[#5a5f6e]">Wallet Status</span>
                                    <span className="text-[#c8cacd] font-medium flex items-center gap-1.5">
                                        <Wallet className="w-3 h-3 text-[#5a5f6e]" />
                                        Updated
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-[#5a5f6e]">Previous Balance</span>
                                        <span className="text-[#5a5f6e]">{format(previousBalance)}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-[#5a5f6e]">New Balance</span>
                                        <span className="text-green-500 font-bold">{format(newBalance)}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col gap-2.5">
                    <button
                        onClick={() => navigate({ to: isSubscription ? ROUTES.HOME : ROUTES.USER.WALLET.ROOT })}
                        className={`w-full py-3 ${isSubscription ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-green-600 hover:bg-green-500 text-white'} active:scale-[0.99] transition-all text-[11px] font-black uppercase tracking-widest rounded-md flex items-center justify-center gap-2`}
                    >
                        {isSubscription ? "Go to Dashboard" : "View Wallet Details"}
                        <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                        onClick={() => navigate({ to: ROUTES.HOME })}
                        className="w-full py-2.5 bg-[#111214] border border-[#1e2025] hover:bg-[#1e2025] text-[#c8cacd] text-[10px] font-bold uppercase tracking-widest rounded-md transition-all"
                    >
                        Back to Home
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4 pt-4">
                    <p className="text-[10px] text-[#3a3d45] text-center px-8 leading-relaxed">
                        A confirmation receipt has been sent to your registered email address.
                    </p>
                    <button
                        onClick={() => navigate({ to: ROUTES.HOME })}
                        className="flex items-center gap-2 text-[10px] text-[#5a5f6e] hover:text-[#c8cacd] transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Explore Platform
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;