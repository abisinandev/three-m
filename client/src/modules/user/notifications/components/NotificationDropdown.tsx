import { Settings, MoreHorizontal } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationBell } from './NotificationBell';
import { NotificationFilters, NotificationList } from './NotificationSubComponents';

export const NotificationDropdown = () => {
    const {
        notifications,
        unreadCount,
        isOpen,
        activeTab,
        dropdownRef,
        setActiveTab,
        handleMarkAsRead,
        handleMarkAllRead,
        toggleOpen
    } = useNotifications();

    return (
        <div className="relative" ref={dropdownRef}>
            <NotificationBell 
                onClick={toggleOpen} 
                isOpen={isOpen} 
                unreadCount={unreadCount} 
            />

            {isOpen && (
                <div className="absolute right-0 mt-3 w-[380px] bg-black rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neutral-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/40">
                        <h3 className="text-sm font-bold text-white tracking-tight">Updates</h3>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 px-2 py-1 uppercase tracking-widest transition-colors"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 transition-colors">
                                <Settings size={14} />
                            </button>
                        </div>
                    </div>

                    <NotificationFilters 
                        activeTab={activeTab} 
                        onTabChange={setActiveTab} 
                        unreadNum={unreadCount} 
                    />

                    <NotificationList 
                        notifications={notifications} 
                        activeTab={activeTab} 
                        onMarkAsRead={handleMarkAsRead} 
                    />

                    {/* Footer */}
                    <div className="p-3 border-t border-neutral-800 bg-neutral-900/40 text-center">
                        <button className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                            View All Activity <MoreHorizontal size={12} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
