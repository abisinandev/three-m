import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import api from "@lib/axiosUser";
import { PAYMENT_ROUTE } from "@shared/constants/userContants";
import { useUserStore } from "@stores/user/UserStore";
import { ROUTES } from "@shared/constants/routes";

import { AddFundsForm, SupportedGateways } from "../components/AddFundsForm";

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000, 50000];
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 100000;

const AddToWallet = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();

    const [amount, setAmount] = useState<number | "">("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const currentBalance = user?.wallet?.balance ?? 0;
    const newBalance = amount ? currentBalance + Number(amount) : currentBalance;

    const validateAmount = (value: number | ""): boolean => {
        if (value === "") {
            setError("Amount is required");
            return false;
        }

        if (isNaN(value)) {
            setError("Invalid amount");
            return false;
        }

        if (value < MIN_AMOUNT) {
            setError(`Minimum allowed deposit is ₹${MIN_AMOUNT}`);
            return false;
        }

        if (value > MAX_AMOUNT) {
            setError(`Maximum deposit limit is ₹${MAX_AMOUNT.toLocaleString("en-IN")}`);
            return false;
        }

        setError(null);
        return true;
    };

    const handleAmountChange = (value: number | "") => {
        setAmount(value);
        validateAmount(value);
    };

    const handlePayment = async () => {
        if (!validateAmount(amount) || loading) return;

        setLoading(true);
        try {
            localStorage.setItem('paymentPurpose', 'TOPUP');
            localStorage.setItem('paymentAmount', String(amount));
            const res = await api.post(PAYMENT_ROUTE, {
                amount: Number(amount),
                purpose: "TOPUP",
            });

            const checkoutUrl = res.data.data.checkoutUrl;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                throw new Error("Checkout URL not received");
            }
        } catch (err) {
            console.error("Payment error", err);
            navigate({ to: ROUTES.USER.PAYMENT.FAILED, replace: true });
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = loading || !!error || !amount;

    return (
        <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] font-sans selection:bg-[#00C853]/20">
            <div className="sticky top-0 z-10 border-b border-[#1e2025] bg-[#0b0c0e]/95 backdrop-blur px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate({ to: ROUTES.USER.WALLET.ROOT })}
                        className="p-1.5 hover:bg-[#111214] border border-transparent hover:border-[#1e2025] rounded transition-all text-[#5a5f6e] hover:text-[#e8eaed]"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-[14px] font-semibold uppercase tracking-tight">Deposit Funds</h1>
                        <p className="text-[10px] text-[#5a5f6e] uppercase tracking-wider mt-0.5">Wallet Top-up</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded">
                    <ShieldCheck size={12} className="text-[#00C853]" />
                    <span className="text-[9px] font-bold text-[#00C853] uppercase tracking-widest">Secure</span>
                </div>
            </div>

            <div className="max-w-[500px] mx-auto pt-8 px-6 pb-12 space-y-6">

                <AddFundsForm 
                    amount={amount}
                    error={error}
                    onAmountChange={handleAmountChange}
                    quickAmounts={QUICK_AMOUNTS}
                />

                <div className="px-1 flex items-center justify-between text-[11px]">
                    <div className="text-[#5a5f6e] font-medium uppercase tracking-wider">
                        Current Balance
                        <div className="text-[#e8eaed] font-bold text-[14px] font-mono mt-1 leading-none tracking-tight">
                            ₹{currentBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="text-right text-[#5a5f6e] font-medium uppercase tracking-wider">
                        Post Deposit
                        <div className="text-[#00C853] font-bold text-[14px] font-mono mt-1 leading-none tracking-tight">
                            ₹{newBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handlePayment}
                        disabled={isDisabled}
                        className="w-full py-3.5 rounded-lg font-bold text-[13px] uppercase tracking-[0.1em] transition-all
                            bg-[#00C853] hover:bg-[#00b04a] text-white shadow-lg
                            disabled:bg-[#1e2025] disabled:text-[#5a5f6e] disabled:cursor-not-allowed disabled:shadow-none
                        "
                    >
                        {loading ? "Redirecting..." : "Continue to Payment"}
                    </button>
                    <p className="text-[10px] text-[#5a5f6e] text-center uppercase tracking-widest font-medium">
                        Secure 256-bit SSL encrypted transaction
                    </p>
                </div>

                <SupportedGateways />
            </div>
        </div>
    );
};

export default AddToWallet;

