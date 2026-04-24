import { RouterProvider } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import { LoaderCircle } from 'lucide-react'
import { useUserStore } from '@stores/user/UserStore';
import { useAdminStore } from '@stores/admin/useAdminStore';
import { router } from './router';
import { useNotificationSocket } from '@modules/user/notifications/hooks/useNotificationSocket';

const App = () => {
    const user = useUserStore();
    const admin = useAdminStore()
    const queryClient = useQueryClient()

    // Initialize real-time listeners
    useNotificationSocket();

    return (
        <Suspense fallback={<LoaderCircle />}>
            <RouterProvider router={router} context={{ user, admin, queryClient }} />
        </Suspense>
    )
}

export default App; 