import ForgotPasswordOTP from '@modules/user/auth/pages/ForgotPasswordOtp'
import { useAuthStore } from '@stores/user/UserAuthStore';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/forgot-password/verify-otp')({
  beforeLoad: () => {
    const { email, clearData, timeLeft } = useAuthStore.getState();

    if (!email) {
      clearData();
      throw redirect({
        to: '/auth/login',
        replace: true,
      });
    }

    const isExpired = !timeLeft || Date.now() > timeLeft;
    if (isExpired) {
      clearData();
      throw redirect({
        to: '/auth/login',
        replace: true,
      });
    }
  },
  component: ForgotPasswordOTP,
})


