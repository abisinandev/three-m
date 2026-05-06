import SignupOTP from '@modules/user/auth/pages/SignupOtpPage';
import { useAuthStore } from '@stores/user/UserAuthStore';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signup/verify-otp')({
  beforeLoad: () => {
    const { email, clearData, timeLeft } = useAuthStore.getState();

    if (!email) {
      clearData();
      throw redirect({
        to: '/auth/signup',
        replace: true,
      });
    }

    const isExpired = !timeLeft || Date.now() > timeLeft;
    if (isExpired) {
      clearData();
      throw redirect({
        to: '/auth/signup',
        replace: true,
      });
    }
  },
  component: SignupOTP,
});
