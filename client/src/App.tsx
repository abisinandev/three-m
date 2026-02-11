import { RouterProvider } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react'
import { useUserStore } from '@stores/user/UserStore';
import { useAdminStore } from '@stores/admin/useAdminStore';
import { router } from './router';
import { useNotificationStore } from '@stores/notification/useNotificationStore';
import { socket } from '@socket';
import { getNotifications } from '@shared/services/notification/notification.service';


const App = () => {

    const user = useUserStore();
    const admin = useAdminStore()
    const queryClient = useQueryClient()

    const addNotification = useNotificationStore(
        (state) => state.addNotification
    );

    const setNotifications = useNotificationStore(
        (state) => state.setNotifications
    );

    useEffect(() => {
        getNotifications().then(setNotifications).catch(console.error);

        socket.on("notification", (data) => {
            addNotification(data);
        });

        return () => {
            socket.off("notification");
        };
    }, [addNotification, setNotifications]);


    return (
        <Suspense fallback={<LoaderCircle />}>
            <RouterProvider router={router} context={{ user, admin, queryClient }} />
        </Suspense>
    )
}

export default App; 