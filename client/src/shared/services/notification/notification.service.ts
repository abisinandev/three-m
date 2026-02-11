import api from "@lib/axiosUser";
import type { Notification } from "@stores/notification/useNotificationStore";

export const getNotifications = async (filter?: 'all' | 'unread'): Promise<Notification[]> => {
    const response = await api.get("/api/notifications", {
        params: { filter }
    });
    return response.data.data;
};

export const markNotificationRead = async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
    await api.patch("/notifications/read-all");
};
