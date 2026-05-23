
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { XCircle, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { ROUTES } from "@shared/constants/routes";

const PaymentFailurePage = () => {
    const navigate = useNavigate();
    const [animated, setAnimated] = useState(false);
    const [attemptedAmount, setAttemptedAmount] = useState<number>(0);
    const [paymentPurpose, setPaymentPurpose] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);

        const storedAmount = localStorage.getItem('paymentAmount');
        const storedPurpose = localStorage.getItem('paymentPurpose');

        if (storedAmount) setAttemptedAmount(Number(storedAmount));
        if (storedPurpose) setPaymentPurpose(storedPurpose);

        return () => clearTimeout(timer);
    }, []);

    const errorMessage = "Your payment could not be processed at this time";

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
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <XCircle className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-tight">Payment Failed</p>
                                <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest mt-0.5">Transaction ID: FAILED_REF_01</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 text-center border-b border-[#1e2025]">
                        <p className="text-[10px] text-[#5a5f6e] uppercase tracking-widest mb-1.5 font-medium">Attempted Amount</p>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#e8eaed]">
                            {format(attemptedAmount)}
                        </h1>
                        <p className="text-[11px] text-red-500 mt-2 font-medium">{errorMessage}</p>
                    </div>

                    <div className="p-5 bg-[#0b0c0e]/50">
                        <div className="flex items-start gap-3 text-orange-400/80">
                            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                            <div className="text-[11px] text-[#5a5f6e] leading-relaxed">
                                <p className="font-bold text-[#c8cacd] mb-1">Common reasons:</p>
                                <ul className="space-y-1 list-disc list-inside">
                                    <li>Insufficient balance</li>
                                    <li>Bank server downtime</li>
                                    <li>Invalid credentials</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col gap-2.5">
                    <button
                        onClick={() => {
                            if (paymentPurpose === 'SUBSCRIPTION') {
                                navigate({ to: ROUTES.USER.HOME });
                            } else {
                                navigate({ to: ROUTES.USER.WALLET.ADD });
                            }
                        }}
                        className="w-full py-3 bg-red-500 hover:bg-red-400 active:scale-[0.99] transition-all text-white text-[11px] font-black uppercase tracking-widest rounded-md flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-white" />
                        Retry Transaction
                    </button>

                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            onClick={() => navigate({ to: ROUTES.USER.WALLET.ROOT })}
                            className="py-2.5 bg-[#111214] border border-[#1e2025] hover:bg-[#1e2025] text-[#c8cacd] text-[10px] font-bold uppercase tracking-widest rounded-md transition-all"
                        >
                            Wallet
                        </button>
                        <button
                            onClick={() => navigate({ to: ROUTES.HOME })}
                            className="py-2.5 bg-[#111214] border border-[#1e2025] hover:bg-[#1e2025] text-[#c8cacd] text-[10px] font-bold uppercase tracking-widest rounded-md transition-all"
                        >
                            Help Desk
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 pt-4">
                    <p className="text-[10px] text-[#3a3d45] text-center px-8 leading-relaxed">
                        If funds were debited, they will be refunded within 3-5 working days.
                    </p>
                    <button
                        onClick={() => navigate({ to: ROUTES.USER.WALLET.ROOT })}
                        className="flex items-center gap-2 text-[10px] text-[#5a5f6e] hover:text-[#c8cacd] transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailurePage;