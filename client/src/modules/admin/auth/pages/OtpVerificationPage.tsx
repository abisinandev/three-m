import adminApi from '@/lib/axios-admin';
import OTPVerification from '@shared/components/otp/OtpComponet'
import { RESEND_OTP, VERIFY_OTP } from '@shared/constants/adminConstants';
import { useOtpControls } from '@shared/hooks/auth/useOtpControls';
import { ROUTES } from '@shared/constants/routes';
import { useAuthStore } from '@stores/user/UserAuthStore';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';


const OtpVerificationPage = () => {
    const { email } = useAuthStore();
    const navigate = useNavigate();

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
    } = useOtpControls(email as string)

    useEffect(() => {
        startTimer();
    }, []);;

    // --- VERIFY OTP MUTATION ---
    const verifyOtp = useMutation({
        mutationFn: async (otp: string) => {
            return await adminApi.post(VERIFY_OTP, { email, otp });
        },
        onSuccess: (res) => {
            toast.success(res.data.message || "Email verified successfully");

            resetOtpState();
            navigate({ to: ROUTES.ADMIN.DASHBOARD, replace: true });
        },
        onError: () => {
            toast.error("Invalid OTP. Please try again.");
        },
    });

    // --- RESEND OTP MUTATION ---
    const resendOtp = useMutation({
        mutationFn: async () => await adminApi.post(RESEND_OTP, { email }),
        onSuccess: (res) => {
            toast.success(res?.data?.message || "OTP resent successfully");
            saveResendMeta();
        },
        onError: () => toast.error("Failed to resend OTP"),
    });

    return (
        <OTPVerification
            title="Verify Your Email"
            email={email as string}
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
    )
}

export default OtpVerificationPage