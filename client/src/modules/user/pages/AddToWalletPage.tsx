import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Smartphone, CreditCard, Building2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import api from "@lib/axiosUser";
import { PAYMENT_ROUTE } from "@shared/constants/userContants";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const AddToWallet = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState<number | "">("");
    const [loading, setLoading] = useState(false);

    const currentBalance = 5500;
    const newBalance = amount ? currentBalance + Number(amount) : currentBalance;

    const handlePayment = async () => {
        if (!amount || loading) return;

        setLoading(true);
        try {
            const res = await api.post(PAYMENT_ROUTE, {
                amount: Number(amount),
                purpose: "ADD_TO_WALLET",
            });

            window.location.href = res.data.checkoutUrl;

        } catch (err) {
            console.error("Failed to create checkout session", err);
            toast.error("Failed to proceed. Please try again.");
            navigate({ to: "/user/payment-failed", replace: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="sticky top-0 z-10 border-b border-[#1f1f1f] bg-black/80 backdrop-blur px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => navigate({ to: "/user/wallet" })}
                    className="p-2 hover:bg-[#1a1a1a] rounded-lg transition"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-lg font-semibold">Add Money</h1>
            </div>

            <div className="max-w-md mx-auto pt-6 px-4 pb-10 space-y-5">
                <div className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-5">
                    <h2 className="text-sm font-medium mb-3 text-gray-300">Enter amount</h2>

                    <div className="relative mb-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value ? Number(e.target.value) : "")
                            }
                            placeholder="0"
                            className="w-full bg-[#111] border border-[#333] rounded-lg pl-9 pr-3 py-3 text-xl font-semibold focus:outline-none focus:border-green-500 transition"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {QUICK_AMOUNTS.map((amt) => (
                            <button
                                key={amt}
                                onClick={() => setAmount(amt)}
                                className={`px-3 py-1.5 rounded-lg text-xs transition ${amount === amt
                                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                                        : "bg-[#1a1a1a] hover:bg-[#222] text-gray-300"
                                    }`}
                            >
                                ₹{amt.toLocaleString("en-IN")}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <div className="text-gray-400">
                            Current balance
                            <div className="text-white font-medium mt-0.5">
                                ₹{currentBalance.toFixed(2)}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-gray-400">After adding</div>
                            <div className="text-green-400 font-semibold mt-0.5">
                                ₹{newBalance.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading || !amount}
                    className="w-full py-3 rounded-xl font-medium text-sm transition shadow-lg bg-gradient-to-r from-[#22C55E] to-[#16a34a] hover:from-[#1fa856] hover:to-[#15803d] shadow-green-500/20 disabled:opacity-50"
                >
                    {loading ? "Redirecting..." : "Continue"}
                </button>

                <div className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-5 space-y-3">
                    <h2 className="text-sm font-medium mb-3 text-gray-300">
                        Popular payment methods
                    </h2>
                    <PaymentOption icon={<Smartphone size={16} />} title="UPI" subtitle="Instant • Recommended" />
                    <PaymentOption icon={<CreditCard size={16} />} title="Debit / Credit Card" subtitle="Visa • Mastercard • RuPay" />
                    <PaymentOption icon={<Building2 size={16} />} title="Net Banking" subtitle="All major banks" />
                </div>

                <button
                    onClick={() => navigate({ to: "/user/wallet" })}
                    className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1.5 mx-auto"
                >
                    <ArrowLeft size={14} />
                    Go back
                </button>
            </div>
        </div>
    );
};

const PaymentOption = ({
    icon,
    title,
    subtitle,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}) => (
    <div className="flex items-center gap-3 px-3 py-3 bg-[#111] rounded-lg hover:bg-[#1a1a1a] transition">
        <div className="p-2 rounded-lg bg-gradient-to-r from-[#22C55E] to-[#16a34a] opacity-90">
            {icon}
        </div>
        <div className="flex-1 text-left">
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-gray-400">{subtitle}</div>
        </div>
        <ChevronRight size={16} className="text-gray-500" />
    </div>
);

export default AddToWallet;
