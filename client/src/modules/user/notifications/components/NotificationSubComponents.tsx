import { Bell } from 'lucide-react';
import type { Notification, NotificationFilter } from '../types/notification.types';
import { NotificationItem } from './NotificationItem';

interface NotificationFiltersProps {
    activeTab: NotificationFilter;
    onTabChange: (tab: NotificationFilter) => void;
    unreadNum: number;
}

export const NotificationFilters = ({ activeTab, onTabChange, unreadNum }: NotificationFiltersProps) => (
    <div className="flex p-1 gap-1 border-b border-neutral-800 bg-black">
        {(['all', 'unread'] as const).map((tab) => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                    activeTab === tab
                        ? 'bg-neutral-800 text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900'
                }`}
            >
                {tab} {tab === 'unread' && unreadNum > 0 && `(${unreadNum})`}
            </button>
        ))}
    </div>
);

interface NotificationListProps {
    notifications: Notification[];
    activeTab: NotificationFilter;
    onMarkAsRead: (id: string, e?: React.MouseEvent) => void;
}

export const NotificationList = ({ notifications, activeTab, onMarkAsRead }: NotificationListProps) => (
    <div className="max-h-[420px] overflow-y-auto custom-scrollbar bg-black">
        {notifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
                <div className="bg-neutral-900/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-800">
                    <Bell className="text-neutral-700" size={20} />
                </div>
                <p className="text-xs text-neutral-400 font-medium">No {activeTab} notifications</p>
                <p className="text-[10px] text-neutral-600 mt-1">We'll let you know when something happens.</p>
            </div>
        ) : (
            <div className="divide-y divide-neutral-900">
                {notifications.map((notif) => (
                    <NotificationItem
                        key={notif.id}
                        notif={notif}
                        onMarkAsRead={onMarkAsRead}
                    />
                ))}
            </div>
        )}
    </div>
);
