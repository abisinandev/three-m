import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { XCircle, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { ROUTES } from "@shared/constants/routes";

const PaymentFailurePage = () => {
    const navigate = useNavigate();

    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const attemptedAmount = 5000;
    const errorMessage = "Your payment could not be processed at this time";

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
                {/* Failure Animation Circle */}
                <div className="flex justify-center">
                    <div
                        className={`relative transition-all duration-1000 ease-out ${animated ? "scale-100 opacity-100" : "scale-0 opacity-0"
                            }`}
                    >
                        {/* Outer red glow */}
                        <div className="absolute inset-0 rounded-full bg-red-500 blur-xl opacity-40 animate-ping" />
                        <div className="absolute inset-0 rounded-full bg-red-600 blur-lg opacity-30 animate-pulse" />

                        {/* X icon container */}
                        <div className="relative p-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-2xl shadow-red-500/30">
                            <XCircle size={96} className="text-white" strokeWidth={2.5} />
                            <AlertCircle
                                size={32}
                                className="absolute -bottom-3 -right-3 text-orange-400 animate-pulse"
                            />
                        </div>
                    </div>
                </div>

                {/* Failure Message */}
                <div className="text-center space-y-4">
                    <h1
                        className={`text-3xl font-bold transition-all duration-700 delay-300 ${animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        Payment Failed
                    </h1>
                    <p
                        className={`text-gray-400 max-w-sm mx-auto transition-all duration-700 delay-500 ${animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        {errorMessage}
                    </p>
                    {attemptedAmount > 0 && (
                        <p
                            className={`text-sm text-gray-500 transition-all duration-700 delay-700 ${animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                }`}
                        >
                            Attempted amount: {format(attemptedAmount)}
                        </p>
                    )}
                </div>

                {/* Info Card */}
                <div
                    className={`bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] p-6 space-y-4 transition-all duration-700 delay-700 ${animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                >
                    <div className="flex items-start gap-3 text-orange-400">
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-300">
                            <p className="font-medium mb-1">Common reasons:</p>
                            <ul className="text-xs text-gray-400 space-y-1">
                                <li>• Insufficient balance or daily limit exceeded</li>
                                <li>• Incorrect card/UPI details</li>
                                <li>• Bank declined the transaction</li>
                                <li>• Temporary network issue</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div
                    className={`space-y-3 transition-all duration-700 delay-1000 ${animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                >
                    <button
                        onClick={() => navigate({ to: ROUTES.USER.WALLET.ADD })} // Change to your add money route
                        className="w-full py-3.5 rounded-xl font-medium text-sm transition shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-orange-500/20"
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </button>

                    <button
                        onClick={() => navigate({ to: ROUTES.USER.WALLET.ROOT })}
                        className="w-full py-3 rounded-xl font-medium text-sm border border-[#333] hover:bg-[#111] transition"
                    >
                        Go to Wallet
                    </button>

                    <button
                        onClick={() => navigate({ to: ROUTES.HOME })}
                        className="w-full py-3 rounded-xl font-medium text-sm border border-[#333] hover:bg-[#111] transition"
                    >
                        Back to Home
                    </button>
                </div>

                {/* Subtle back link */}
                <button
                    onClick={() => navigate({ to: ROUTES.USER.WALLET.ROOT })}
                    className="text-xs text-gray-500 hover:text-gray-300 transition flex items-center gap-1.5 mx-auto mt-8"
                >
                    <ArrowLeft size={14} />
                    Go back
                </button>
            </div>
        </div>
    );
};

export default PaymentFailurePage;