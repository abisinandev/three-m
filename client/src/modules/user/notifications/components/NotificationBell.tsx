import { Bell } from 'lucide-react';

interface NotificationBellProps {
    onClick: () => void;
    isOpen: boolean;
    unreadCount: number;
}

export const NotificationBell = ({ onClick, isOpen, unreadCount }: NotificationBellProps) => {
    return (
        <button
            id="notification-bell"
            onClick={onClick}
            className={`relative p-2 rounded-xl transition-all duration-300 ${
                isOpen ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
        >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
            )}
        </button>
    );
};
