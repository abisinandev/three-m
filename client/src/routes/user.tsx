import NotFoundPage from '@shared/components/error/NotFoundComponent';
import UserLayout from '@shared/layouts/user/UserLayout';
import { ProfileApi } from '@shared/services/user/ProfileApi';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/user')({
    beforeLoad: async ({ context }) => {
        try {
            const { data } = await ProfileApi();
            context.user.setUser(data);
        } catch (error) {
            throw redirect({ to: "/auth/login" })
        }
    },
    notFoundComponent: () => <NotFoundPage />,
    component: UserLayout,
})

