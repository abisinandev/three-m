import { useEffect } from 'react';
import { socket } from '@socket';
import { useNotificationStore } from '@stores/notification/useNotificationStore';
import { toast } from 'sonner';

export const useNotificationSocket = () => {
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        const handler = (data: any) => {
            addNotification(data);
            
            // Trigger visual toast
            toast.info(data.title || 'New Notification', {
                description: data.message,
                duration: 5000,
            });
        };

        socket.on("notification", handler);

        return () => {
            socket.off("notification", handler);
        };
    }, [addNotification]);
};
