import { useOtpControls } from "@shared/hooks/auth/useOtpControls";
import { useAuthStore } from "@stores/user/UserAuthStore";
import OTPVerification from "@shared/components/otp/OtpComponet";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { FORGOT_PASSWORD_VERIFY, FORGOT_PASSWORD_RESEND } from "@shared/constants/userContants";
import api from "@/lib/axios-user";
import { toast } from "sonner";
import { ROUTES } from "@shared/constants/routes";

export default function ForgotPasswordOTP() {
  const { email, setData } = useAuthStore();
  const expirationTime = Date.now() + 5 * 60 * 1000;
  const controls = useOtpControls(email as string);
  const navigate = useNavigate();

  // --- VERIFY OTP ---
  const verifyOtp = useMutation({
    mutationFn: async (otp: string) =>
      await api.post(FORGOT_PASSWORD_VERIFY, { email, otp }),

    onSuccess: (res) => {
      toast.success(res.data.message || "Otp verified. You can reset your password");
      controls.resetOtpState();
      console.log("Forgot otp verify: ", res.data)
      localStorage.removeItem(controls.storageKey);
      setData(email as string, expirationTime, res.data.data.resetToken);
      navigate({ to: ROUTES.AUTH.RESET_PASSWORD })
    },

    onError: () => toast.error("Invalid OTP"),
  });

  // --- RESEND OTP ---
  const resendOtp = useMutation({
    mutationFn: async () => await api.post(FORGOT_PASSWORD_RESEND, { email }),

    onSuccess: () => {
      toast.success("OTP resent");
      controls.saveResendMeta();
    },

    onError: () => toast.error("Failed to resend OTP"),
  });

  return (
    <OTPVerification
      title="Reset Password Verification"
      email={email as string}
      otpValues={controls.otpValues}
      setOtpValues={controls.setOtpValues}
      timeLeft={controls.timeLeft}
      canResend={controls.canResend}
      resendCount={controls.resendCount}
      MAX_RESEND={controls.MAX_RESEND}
      isLoading={verifyOtp.isPending}
      onVerify={() => verifyOtp.mutate(controls.otpValues.join(""))}
      onResend={() => resendOtp.mutate()}
    />
  );
}
