export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt?: string | Date;
    signalId?: string; // only present on ALGO_SIGNAL notifications
}

export type NotificationFilter = 'all' | 'unread';
