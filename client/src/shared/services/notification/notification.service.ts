import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { Notification } from "@stores/notification/useNotificationStore";

export const getNotifications = async (
    filter?: 'all' | 'unread'
): Promise<Notification[]> => {
    const response = await api.get(API_ROUTES.USER.NOTIFICATIONS.GET_ALL, {
        params: filter ? { filter } : undefined,
    });

    return response.data.data.map((item: Notification) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        read: item.read,
        createdAt: item.createdAt,
    }));
};


export const markNotificationRead = async (id: string): Promise<void> => {
    await api.patch(API_ROUTES.USER.NOTIFICATIONS.MARK_READ(id));
};

export const markAllNotificationsRead = async (): Promise<void> => {
    await api.patch(API_ROUTES.USER.NOTIFICATIONS.MARK_ALL_READ);
};
