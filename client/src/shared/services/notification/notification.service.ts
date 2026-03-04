import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { Notification } from "@stores/notification/useNotificationStore";

export const getNotifications = async (
    filter?: 'all' | 'unread'
): Promise<Notification[]> => {
    const response = await api.get(API_ROUTES.USER.NOTIFICATIONS.GET_ALL, {
        params: filter ? { filter } : undefined,
    });

    return response.data.data.map((item: { _id: string, _type: string, _message: string, _read: boolean, _createdAt: string }) => ({
        id: item._id,
        type: item._type,
        message: item._message,
        read: item._read,
        createdAt: item._createdAt,
    }));
};


export const markNotificationRead = async (id: string): Promise<void> => {
    await api.patch(API_ROUTES.USER.NOTIFICATIONS.MARK_READ(id));
};

export const markAllNotificationsRead = async (): Promise<void> => {
    await api.patch(API_ROUTES.USER.NOTIFICATIONS.MARK_ALL_READ);
};
