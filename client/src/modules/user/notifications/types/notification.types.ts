export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt?: string | Date;
    signalId?: string; 
}

export type NotificationFilter = 'all' | 'unread';
