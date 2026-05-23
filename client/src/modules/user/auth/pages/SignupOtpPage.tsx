import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useOtpControls } from "@shared/hooks/auth/useOtpControls";
import { useAuthStore } from "@stores/user/UserAuthStore";
import OTPVerification from "@shared/components/otp/OtpComponet";
import { RESEND_OTP, VERIFY_OTP } from "@shared/constants/userContants";
import api from "@/lib/axios-user";
import { toast } from "sonner";
import { ROUTES } from "@shared/constants/routes";



export default function SignupOTP() {
    const navigate = useNavigate();
    const email = useAuthStore((s) => s.email)!;

    const {
        otpValues,
        setOtpValues,
        timeLeft,
        canResend,
        resendCount,
        MAX_RESEND,
        saveResendMeta,
        startTimer,
        resetOtpState,
    } = useOtpControls(email);

    useEffect(() => {
        startTimer();
    }, [startTimer]);

    // --- VERIFY OTP MUTATION ---
    const verifyOtp = useMutation({
        mutationFn: async (otp: string) => {
            return await api.post(VERIFY_OTP, { email, otp });
        },
        onSuccess: (res) => {
            toast.success(res.data.message || "Email verified successfully");

            resetOtpState();
            navigate({ to: ROUTES.AUTH.LOGIN });
        },
        onError: () => {
            toast.error("Invalid OTP. Please try again.");
        },
    });

    // --- RESEND OTP MUTATION ---
    const resendOtp = useMutation({
        mutationFn: async () => await api.post(RESEND_OTP, { email }),
        onSuccess: (res) => {
            toast.success(res?.data?.message || "OTP resent successfully");
            saveResendMeta();
        },
        onError: () => toast.error("Failed to resend OTP"),
    });

    return (
        <OTPVerification
            title="Verify Your Email"
            email={email}
            otpValues={otpValues}
            setOtpValues={setOtpValues}
            timeLeft={timeLeft}
            canResend={canResend}
            resendCount={resendCount}
            MAX_RESEND={MAX_RESEND}
            isLoading={verifyOtp.isPending}
            onVerify={() => verifyOtp.mutate(otpValues.join(""))}
            onResend={() => resendOtp.mutate()}
        />
    );
}
