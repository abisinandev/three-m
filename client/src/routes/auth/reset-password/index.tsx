import ResetPasswordPage from '@modules/user/auth/pages/ResetPasswordPage'
import { useAuthStore } from '@stores/user/UserAuthStore'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/reset-password/')({
  beforeLoad: () => {
    const { email, token, timeLeft, clearData } = useAuthStore.getState();
    const isExpired = !timeLeft || Date.now() > timeLeft;
 
    if (!email || !token || isExpired) {
      clearData();
      throw redirect({
        to: '/auth/login',
        replace: true,
      });
    }
  },
  component: ResetPasswordPage,
});
