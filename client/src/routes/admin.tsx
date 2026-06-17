import adminApi from '@/lib/axios-admin';
import NotFoundPage from '@shared/components/error/NotFoundComponent';

import AdminLayout from '@shared/layouts/admin/AdminLayout'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ROUTES, API_ROUTES } from '@shared/constants/apiRoutes';

export const Route = createFileRoute('/admin')({
    beforeLoad: async ({ context }) => {
        try {
            const { data } = await adminApi.get(API_ROUTES.ADMIN.USERS.PROFILE);
            context.admin.setData(data);
        } catch {
            throw redirect({ to: ROUTES.ADMIN.AUTH.LOGIN })
        }
    },
    notFoundComponent: () => <NotFoundPage />,
    component: Layout,
})

function Layout() {
    return <>
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    </>
}
