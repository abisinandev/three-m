import { create } from "zustand";

export interface Notification {
    id: string;
    type: "EXPENSE" | "WALLET" | "SIP" | "ALGO_SIGNAL" | "MUTUAL_FUND" | "INFO" | "WARNING";
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    signalId?: string;       // only present on ALGO_SIGNAL notifications
    expiresAt?: string;      // signal expiry timestamp (ISO string)
    data?: Record<string, unknown>;
}

interface NotificationStore {
    notifications: Notification[];
    addNotification: (n: Notification) => void;
    setNotifications: (n: Notification[]) => void;
    markRead: (id: string) => void;
    markAllRead: () => void;
    unreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],
    addNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
        })),
    setNotifications: (notifications) => set({ notifications }),
    markRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),
    markAllRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
    unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
