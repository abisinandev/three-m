 
import ForgotPasswordPage from '@modules/user/auth/pages/ForgotPassword';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/forgot-password/')({
  component: ForgotPasswordPage,
});

 
