export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt?: string | Date;
    signalId?: string;
    expiresAt?: string | Date;
    data?: {
        signalId?: string;
        expiresAt?: string;
        symbol?: string;
        action?: string;
        price?: number;
        [key: string]: unknown;
    };
}

export type NotificationFilter = 'all' | 'unread';
