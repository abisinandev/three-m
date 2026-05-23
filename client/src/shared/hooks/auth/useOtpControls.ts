import { useEffect, useState, useCallback } from "react";

export const useOtpControls = (email: string) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const storageKey = `otp_${email}`;
  const MAX_RESEND = 3;

  const startTimer = useCallback(() => {
    setTimeLeft(60);
    setCanResend(false);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      const data = JSON.parse(stored);
      const remaining = Math.max(
        0,
        Math.floor((data.expiresAt - Date.now()) / 1000)
      );

      setTimeLeft(remaining);
      setResendCount(data.resendCount);
      setCanResend(remaining <= 0);

      if (remaining <= 0) {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const resetOtpState = () => {
    setOtpValues(Array(6).fill(""));
    setResendCount(0);
    setCanResend(false);
    setTimeLeft(60);
    localStorage.removeItem(storageKey);
  };

  const saveResendMeta = () => {
    const expiresAt = Date.now() + 60 * 1000;
    const newCount = resendCount + 1;

    setResendCount(newCount);
    setCanResend(false);
    setTimeLeft(60);

    localStorage.setItem(
      storageKey,
      JSON.stringify({ expiresAt, resendCount: newCount })
    );
  };

  return {
    otpValues,
    setOtpValues,
    timeLeft,
    canResend,
    resendCount,
    MAX_RESEND,
    resetOtpState,
    saveResendMeta,
    startTimer,
    storageKey,
  };
};
