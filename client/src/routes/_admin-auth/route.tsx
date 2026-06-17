import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { ROUTES } from '@shared/constants/apiRoutes';

export const Route = createFileRoute('/_admin-auth')({
    beforeLoad: ({ context }) => {
        if (context.admin?.data) {
            throw redirect({ to: ROUTES.ADMIN.DASHBOARD });
        }
    },
    component: () => (
        <>
            <Outlet />
        </>
    ),
});