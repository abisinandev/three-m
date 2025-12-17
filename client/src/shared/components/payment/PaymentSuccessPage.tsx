import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, ArrowLeft, Wallet, Sparkles } from "lucide-react";

const PaymentSuccessPage = () => {
    const navigate = useNavigate();

    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);
    const addedAmount = 5000;
    const previousBalance = 5500;
    const newBalance = previousBalance + addedAmount;

    const format = (v: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(v);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-5">
            <div className="max-w-md w-full space-y-8">

                <div className="flex justify-center">
                    <div
                        className={`relative transition-all duration-1000 ease-out ${animated ? "scale-100 opacity-100" : "scale-0 opacity-0"
                            }`}
                    >

                        <div className="absolute inset-0 rounded-full bg-green-500 blur-xl opacity-50 animate-ping" />
                        <div className="absolute inset-0 rounded-full bg-green-500 blur-lg opacity-30 animate-pulse" />


                        <div className="relative p-8 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16a34a] shadow-2xl shadow-green-500/30">
                            <CheckCircle size={96} className="text-white" strokeWidth={2.5} />
                            <Sparkles
                                size={28}
                                className="absolute -top-2 -right-2 text-yellow-300 animate-pulse"
                            />
                            <Sparkles
                                size={20}
                                className="absolute -bottom-3 left-4 text-yellow-300 animate-pulse delay-300"
                            />
                        </div>
                    </div>
                </div>


                <div className="text-center space-y-4">
                    <h1
                        className={`text-3xl font-bold transition-all duration-700 delay-300 ${animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        Payment Successful!
                    </h1>
                    <p
                        className={`text-gray-400 transition-all duration-700 delay-500 ${animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        ₹{addedAmount.toLocaleString("en-IN")} has been successfully added to your wallet.
                    </p>
                </div>


                <div
                    className={`bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] p-6 space-y-5 transition-all duration-700 delay-700 ${animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                >
                    <div className="flex items-center gap-3 text-green-400">
                        <Wallet size={20} />
                        <span className="text-sm font-medium">Updated Wallet Balance</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Previous balance</span>
                            <span className="text-gray-400">{format(previousBalance)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Amount added</span>
                            <span className="text-green-400 font-medium">+{format(addedAmount)}</span>
                        </div>
                        <div className="border-t border-[#1f1f1f] pt-3">
                            <div className="flex justify-between">
                                <span className="text-gray-300">New balance</span>
                                <span className="text-2xl font-bold text-green-400">{format(newBalance)}</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div
                    className={`space-y-3 transition-all duration-700 delay-1000 ${animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                >
                    <button
                        onClick={() => navigate({ to: "/user/wallet" })}
                        className="w-full py-3.5 rounded-xl font-medium text-sm transition shadow-lg bg-gradient-to-r from-[#22C55E] to-[#16a34a] hover:from-[#1fa856] hover:to-[#15803d] shadow-green-500/20"
                    >
                        View Wallet
                    </button>

                    <button
                        onClick={() => navigate({ to: "/" })}
                        className="w-full py-3 rounded-xl font-medium text-sm border border-[#333] hover:bg-[#111] transition"
                    >
                        Back to Home
                    </button>
                </div>

                {/* Subtle back link */}
                <button
                    onClick={() => navigate({ to: "/user/wallet" })}
                    className="text-xs text-gray-500 hover:text-gray-300 transition flex items-center gap-1.5 mx-auto mt-8"
                >
                    <ArrowLeft size={14} />
                    Go back
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;