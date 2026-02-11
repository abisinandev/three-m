import { Bell, MoreHorizontal, Settings, Info, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { useNotificationStore } from '@stores/notification/useNotificationStore';
import { markNotificationRead, markAllNotificationsRead } from '@shared/services/notification/notification.service';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

type NotificationFilter = 'all' | 'unread';

export const NotificationDropdown = () => {
    const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<NotificationFilter>('all');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'unread') return !n.read;
        return true;
    });

    const unreadNum = unreadCount();

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

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            markAllRead();
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'EXPENSE': return <AlertTriangle className="text-rose-500" size={16} />;
            case 'WALLET': return <Zap className="text-amber-500" size={16} />;
            case 'SIP': return <CheckCircle2 className="text-emerald-500" size={16} />;
            default: return <Info className="text-blue-500" size={16} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-xl transition-all duration-300 ${isOpen ? 'bg-[#1a1a1a] text-white' : 'text-neutral-500 hover:text-neutral-200 hover:bg-[#111]'}`}
            >
                <Bell className="w-5 h-5" />
                {unreadNum > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-[360px] bg-[#0A0A0A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#1A1A1A] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-[#1A1A1A] flex items-center justify-between bg-[#0F0F0F]">
                        <h3 className="text-sm font-bold text-white tracking-tight">Updates</h3>
                        <div className="flex items-center gap-1">
                            {unreadNum > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest px-2 py-1"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button className="p-1.5 rounded-lg hover:bg-[#1A1A1A] text-neutral-500 hover:text-neutral-200 transition-colors">
                                <Settings size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 gap-1 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                        {(['all', 'unread'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab
                                    ? 'bg-[#151515] text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#0F0F0F]'}`}
                            >
                                {tab} {tab === 'unread' && unreadNum > 0 && `(${unreadNum})`}
                            </button>
                        ))}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-[#0A0A0A]">
                        {filteredNotifications.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="bg-[#0F0F0F] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#1A1A1A]">
                                    <Bell className="text-neutral-700" size={20} />
                                </div>
                                <p className="text-xs text-neutral-400 font-medium">No {activeTab} notifications</p>
                                <p className="text-[10px] text-neutral-600 mt-1">We'll let you know when something happens.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#151515]">
                                {filteredNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={(e) => !notif.read && handleMarkAsRead(notif.id, e as any)}
                                        className={`px-4 py-4 flex gap-4 transition-all cursor-pointer ${notif.read ? 'bg-transparent opacity-60' : 'bg-[#0E0E0E] hover:bg-[#131313]'}`}
                                    >
                                        <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${notif.read ? 'border-[#1A1A1A] bg-[#111]' : 'border-blue-500/10 bg-blue-500/5'}`}>
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <p className={`text-xs font-bold truncate ${notif.read ? 'text-neutral-400' : 'text-white'}`}>
                                                    {notif.title}
                                                </p>
                                                {!notif.read && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                )}
                                            </div>
                                            <p className={`text-[11px] leading-relaxed mb-2 ${notif.read ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-[#1A1A1A] bg-[#0F0F0F] text-center">
                        <button className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                            View All Activity <MoreHorizontal size={12} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
