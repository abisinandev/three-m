import api from "@lib/axiosUser";
export const getNotifications = async (): Promise<Notification[]> => {
    const response = await api.get("/api/notifications");
    return response.data.data;
};

export const markNotificationRead = async (id: string): Promise<void> => {
    await api.patch(`/api/notifications/${id}/read`);
};
