import { useEffect } from 'react';
import { socket } from '@socket';
import { useNotificationStore } from '@stores/notification/useNotificationStore';

export const useNotificationSocket = () => {
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        const handler = (data: any) => {
            addNotification(data);
        };

        socket.on("notification", handler);

        return () => {
            socket.off("notification", handler);
        };
    }, [addNotification]);
};
