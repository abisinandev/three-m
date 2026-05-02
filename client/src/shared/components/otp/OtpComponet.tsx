import React, { useRef } from "react";
import { Loader2 } from "lucide-react";

interface OTPProps {
    email: string;
    title?: string;

    otpValues: string[];
    setOtpValues: (o: string[]) => void;

    timeLeft: number;
    canResend: boolean;
    resendCount: number;
    MAX_RESEND: number;

    isLoading: boolean;

    onVerify: () => void;
    onResend: () => void;
}

const OTPVerification: React.FC<OTPProps> = ({
    email,
    title = "Verify OTP",
    otpValues,
    setOtpValues,
    timeLeft,
    canResend,
    resendCount,
    MAX_RESEND,
    isLoading,
    onVerify,
    onResend,
}) => {
    const inputsRef = useRef<HTMLInputElement[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        if (!/^[0-9]?$/.test(value)) return;

        const next = [...otpValues];
        next[index] = value;
        setOtpValues(next);

        if (value && index < 5) inputsRef.current[index + 1]?.focus();
        if (!value && index > 0) inputsRef.current[index - 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (paste.length === 0) return;

        const next = Array(6).fill("");
        for (let i = 0; i < paste.length; i++) next[i] = paste[i];

        setOtpValues(next);
        inputsRef.current[Math.min(paste.length - 1, 5)]?.focus();
    };

    const setInputRef = (index: number) => (el: HTMLInputElement | null): void => {
        if (el) inputsRef.current[index] = el;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-deep-charcoal px-4">
            <div className="bg-neutral-900/50 border border-neutral-800/60 p-6 rounded-xl shadow-lg w-full max-w-[360px]">

                <h1 className="text-xl font-semibold text-white text-center mb-4 tracking-tight">{title}</h1>

                <p className="text-gray-400 text-center text-sm mb-6">
                    We sent a 6-digit code to <br />
                    <span className="text-white font-semibold">{email}</span>
                </p>

                <div className="flex justify-center gap-3 mb-8">
                    {otpValues.map((v, i) => (
                        <input
                            key={i}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={v}
                            ref={setInputRef(i)}
                            onChange={(e) => handleChange(e, i)}
                            onPaste={handlePaste}
                            className="
                                w-10 h-10 text-base font-semibold text-center 
                                bg-white text-black rounded-md
                                focus:ring-2 focus:ring-teal-400 outline-none
                                transition-all duration-150
                            "
                        />
                    ))}
                </div>

                <div className="flex justify-between text-sm mb-4">

                    {resendCount >= MAX_RESEND ? (
                        <span className="text-red-500">
                            Max resend attempts reached
                        </span>
                    ) : (
                        <>
                            <span className="text-gray-400">
                                {canResend
                                    ? "Didn’t receive the code?"
                                    : `Resend in ${timeLeft}s`}
                            </span>

                            <button
                                disabled={!canResend}
                                onClick={onResend}
                                className={`font-medium transition 
                                    ${canResend ? "text-teal-400" : "text-gray-600 cursor-not-allowed"}
                                `}
                            >
                                Resend OTP
                            </button>
                        </>
                    )}

                </div>

                <button
                    onClick={onVerify}
                    disabled={isLoading || otpValues.join("").length !== 6}
                    className="
                        w-full py-2.5 rounded shadow-sm text-sm
                        bg-teal-green text-white font-semibold
                        flex items-center justify-center gap-2
                        disabled:opacity-60 disabled:cursor-not-allowed
                        hover:bg-green-600 transition-all duration-200
                    "
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        "Verify"
                    )}
                </button>

                {!canResend && (
                    <p className="text-center text-gray-400 text-xs mt-3">
                        OTP expires in <span className="text-white">{timeLeft}s</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default OTPVerification;
