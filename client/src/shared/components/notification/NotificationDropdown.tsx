import { Bell, Check } from 'lucide-react';
import { useNotificationStore } from '@stores/notification/useNotificationStore';
import { markNotificationRead } from '@shared/services/notification/notification.service';
import { useState, useRef, useEffect } from 'react';

export const NotificationDropdown = () => {
    const { notifications, unreadCount, markRead } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            await markNotificationRead(id);
            markRead(id);
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors group"
            >
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition" />
                {unreadCount() > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0f0f0f]">
                        {unreadCount() > 9 ? '9+' : unreadCount()}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#111] rounded-lg shadow-2xl border border-[#2a2a2a] overflow-hidden z-50">
                    <div className="p-3 border-b border-[#2a2a2a] flex justify-between items-center bg-[#151515]">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Notifications</h3>
                        <span className="text-[10px] text-gray-500 bg-[#222] px-2 py-0.5 rounded-full border border-[#333]">
                            {notifications.length} Total
                        </span>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500 text-xs">
                                No new notifications
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={`relative px-4 py-3 group border-b border-[#1a1a1a] last:border-0 transition-colors ${notif.read ? 'bg-[#0f0f0f] opacity-60' : 'bg-[#161616] hover:bg-[#1c1c1c]'
                                        }`}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1">
                                            <p className={`text-xs font-medium mb-1 ${notif.read ? 'text-gray-400' : 'text-gray-200'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <span className="text-[10px] text-gray-600 mt-2 block font-mono">
                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {!notif.read && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(notif._id, e)}
                                                className="shrink-0 p-1 rounded-full hover:bg-[#2a2a2a] text-gray-500 hover:text-[#22C55E] transition-colors"
                                                title="Mark as read"
                                            >
                                                <Check size={14} strokeWidth={3} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
