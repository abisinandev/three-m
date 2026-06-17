import { createFileRoute, redirect } from '@tanstack/react-router'
import { ROUTES } from '@shared/constants/apiRoutes';
import { LandingPage } from '@/modules/user/dashboard/components/LandingPageComponent';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    if (context.user.isAuthenticated && !context.user.isBlocked) {
      throw redirect({ to: ROUTES.AUTH.LOGIN })
    }
  },
  component: LandingPage,
})
