import NotFoundPage from '@shared/components/error/NotFoundComponent';
import UserLayout from '@shared/layouts/user/UserLayout';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ROUTES } from '@shared/constants/routes';
import { useUserStore } from '@stores/user/UserStore';

export const Route = createFileRoute('/user')({
    beforeLoad: async () => {
        const { isAuthenticated } = useUserStore.getState();
        if (!isAuthenticated) {
            throw redirect({ to: ROUTES.AUTH.LOGIN });
        }
    },
    notFoundComponent: () => <NotFoundPage />,
    component: UserLayout,
})


