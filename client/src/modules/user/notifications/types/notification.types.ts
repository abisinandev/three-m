export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt?: string | Date;
    signalId?: string; 
    data?: {
        signalId?: string;
        [key: string]: unknown;
    };
}

export type NotificationFilter = 'all' | 'unread';
