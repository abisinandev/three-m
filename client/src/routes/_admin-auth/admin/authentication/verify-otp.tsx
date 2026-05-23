import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@stores/user/UserAuthStore';
import OtpVerificationPage from '@/modules/admin/auth/pages/OtpVerificationPage';

export const Route = createFileRoute('/_admin-auth/admin/authentication/verify-otp')({
  beforeLoad: () => {
    const { email, clearData, timeLeft } = useAuthStore.getState();
    console.log(email, timeLeft)

    if (!email) {
      clearData();
      throw redirect({
        to: '/admin/authentication',
        replace: true,
      });
    }

    const isExpired = !timeLeft || Date.now() > timeLeft;
    if (isExpired) {
      clearData();
      throw redirect({
        to: '/admin/authentication',
        replace: true,
      });
    }

  },
  component: OtpVerificationPage,
})