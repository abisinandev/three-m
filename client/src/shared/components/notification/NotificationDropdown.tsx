import { Bell, MoreHorizontal, Settings, Info, AlertTriangle, Zap, CheckCircle2, Activity } from 'lucide-react';
import { useNotificationStore } from '@stores/notification/useNotificationStore';
import { markNotificationRead, markAllNotificationsRead } from '@shared/services/notification/notification.service';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlgoTradingApiService } from '@shared/services/stock/algo-trading-api';

type NotificationFilter = 'all' | 'unread';

interface NotifItem {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt?: string | Date;
    signalId?: string;
}

const NotificationItem = ({
    notif,
    getIcon,
    onMarkAsRead,
}: {
    notif: NotifItem;
    getIcon: (type: string) => React.ReactNode;
    onMarkAsRead: (id: string, e: React.MouseEvent) => void;
}) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [confirming, setConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const extractAction = (message: string): 'BUY' | 'SELL' | null => {
        if (message.toUpperCase().includes('BUY')) return 'BUY';
        if (message.toUpperCase().includes('SELL')) return 'SELL';
        return null;
    };

    const extractSymbol = (message: string): string => {
        const match = message.match(/for\s+([A-Z0-9.]+)/i);
        return match ? match[1].toUpperCase() : '';
    };

    const handleConfirm = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const action = extractAction(notif.message);
        const symbol = extractSymbol(notif.message);

        if (!action || !symbol) { setError('Cannot parse signal details'); return; }
        if (quantity <= 0) { setError('Enter a valid quantity'); return; }

        setConfirming(true);
        setError(null);

        try {
            await AlgoTradingApiService.confirmSignal({
                notificationId: notif.id,
                signalId: notif.signalId!, // guaranteed by the guard below
                symbol,
                action,
                quantity,
            });
            setConfirmed(true);
            onMarkAsRead(notif.id, e);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Order failed. Try again.');
        } finally {
            setConfirming(false);
        }
    };

    const isAlgo = notif.type === 'ALGO_SIGNAL';

    return (
        <div
            onClick={(e) => !notif.read && onMarkAsRead(notif.id, e as any)}
            className={`px-4 py-4 flex gap-4 transition-all cursor-pointer ${notif.read ? 'bg-transparent opacity-60' : 'bg-[#0E0E0E] hover:bg-[#131313]'}`}
        >
            {/* Icon */}
            <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${notif.read
                    ? 'border-[#1A1A1A] bg-[#111]'
                    : isAlgo
                        ? 'border-purple-500/10 bg-purple-500/5'
                        : 'border-blue-500/10 bg-blue-500/5'
                }`}>
                {getIcon(notif.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Title row */}
                <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-xs font-bold truncate ${notif.read ? 'text-neutral-400' : 'text-white'}`}>
                        {notif.title}
                    </p>
                    {!notif.read && (
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isAlgo ? 'bg-purple-500' : 'bg-blue-500'}`} />
                    )}
                </div>

                {/* Message */}
                <p className={`text-[11px] leading-relaxed mb-2 ${notif.read ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {notif.message}
                </p>

                {/* Footer row */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                        {notif.createdAt && !isNaN(new Date(notif.createdAt).getTime())
                            ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })
                            : 'Just now'}
                    </span>

                    {/* Confirm CTA – only for unread ALGO_SIGNAL before placing order */}
                    {isAlgo && !notif.read && !confirmed && (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            {notif.signalId ? (
                                <>
                                    <input
                                        id={`qty-${notif.id}`}
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={e => { setQuantity(Number(e.target.value)); setError(null); }}
                                        className="w-14 text-[10px] bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-md px-2 py-1 focus:outline-none focus:border-purple-500/50 transition-colors"
                                        placeholder="Qty"
                                    />
                                    <button
                                        id={`confirm-btn-${notif.id}`}
                                        onClick={handleConfirm}
                                        disabled={confirming}
                                        className="text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 hover:text-purple-300 px-3 py-1 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {confirming ? '...' : 'Confirm'}
                                    </button>
                                </>
                            ) : (
                                <span className="text-[9px] text-neutral-600 uppercase tracking-widest">Signal expired</span>
                            )}
                        </div>
                    )}

                    {/* Success feedback */}
                    {confirmed && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Order Placed
                        </span>
                    )}
                </div>

                {/* Inline error */}
                {error && (
                    <p className="text-[10px] text-rose-400 mt-1">{error}</p>
                )}
            </div>
        </div>
    );
};

// ─── Main dropdown ────────────────────────────────────────────────────────────

export const NotificationDropdown = () => {
    const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<NotificationFilter>('all');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredNotifications = notifications.filter(n =>
        activeTab === 'unread' ? !n.read : true
    );
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
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            markAllRead();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'EXPENSE': return <AlertTriangle className="text-rose-500" size={16} />;
            case 'WALLET': return <Zap className="text-amber-500" size={16} />;
            case 'SIP': return <CheckCircle2 className="text-emerald-500" size={16} />;
            case 'ALGO_SIGNAL': return <Activity className="text-purple-500" size={16} />;
            default: return <Info className="text-blue-500" size={16} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell button */}
            <button
                id="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-xl transition-all duration-300 ${isOpen ? 'bg-[#1a1a1a] text-white' : 'text-neutral-500 hover:text-neutral-200 hover:bg-[#111]'
                    }`}
            >
                <Bell className="w-5 h-5" />
                {unreadNum > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-[380px] bg-[#0A0A0A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#1A1A1A] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">

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
                                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#0F0F0F]'
                                    }`}
                            >
                                {tab} {tab === 'unread' && unreadNum > 0 && `(${unreadNum})`}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="max-h-[420px] overflow-y-auto custom-scrollbar bg-[#0A0A0A]">
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
                                    <NotificationItem
                                        key={notif.id}
                                        notif={notif}
                                        getIcon={getIcon}
                                        onMarkAsRead={handleMarkAsRead}
                                    />
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
