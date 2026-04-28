import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, AlertTriangle, Zap, Activity, Info } from 'lucide-react';
import { AlgoTradingApiService } from '@shared/services/stock/algo-trading-api';
import type { Notification } from '../types/notification.types';

interface NotificationItemProps {
    notif: Notification;
    onMarkAsRead: (id: string, e?: React.MouseEvent) => void;
}

export const NotificationItem = ({ notif, onMarkAsRead }: NotificationItemProps) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [confirming, setConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getIcon = (type: string) => {
        switch (type) {
            case 'EXPENSE': return <AlertTriangle className="text-rose-500" size={16} />;
            case 'WALLET': return <Zap className="text-amber-500" size={16} />;
            case 'SIP': return <CheckCircle2 className="text-emerald-500" size={16} />;
            case 'ALGO_SIGNAL': return <Activity className="text-purple-500" size={16} />;
            default: return <Info className="text-blue-500" size={16} />;
        }
    };

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
        const action = notif.data?.action || extractAction(notif.message);
        const symbol = notif.data?.symbol || extractSymbol(notif.message);

        if (!action || !symbol) { setError('Cannot parse signal details'); return; }
        if (quantity <= 0) { setError('Enter a valid quantity'); return; }

        setConfirming(true);
        setError(null);

        try {
            await AlgoTradingApiService.confirmSignal({
                notificationId: notif.id,
                signalId: (notif.signalId || notif.data?.signalId)!,
                symbol,
                action,
                quantity,
            });
            setConfirmed(true);
            onMarkAsRead(notif.id);
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
            className={`px-4 py-4 flex gap-4 transition-all cursor-pointer ${
                notif.read ? 'bg-transparent opacity-60' : 'bg-neutral-900/60 hover:bg-neutral-900'
            }`}
        >
            <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                notif.read
                    ? 'border-neutral-800 bg-neutral-900'
                    : isAlgo
                        ? 'border-purple-500/10 bg-purple-500/5'
                        : 'border-blue-500/10 bg-blue-500/5'
            }`}>
                {getIcon(notif.type)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-xs font-bold truncate ${notif.read ? 'text-neutral-400' : 'text-white'}`}>
                        {notif.title}
                    </p>
                    {!notif.read && (
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isAlgo ? 'bg-purple-500' : 'bg-blue-500'}`} />
                    )}
                </div>

                <p className={`text-[11px] leading-relaxed mb-2 ${notif.read ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {notif.message}
                </p>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                        {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>

                    {isAlgo && !notif.read && !confirmed && (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            {(notif.signalId || notif.data?.signalId) ? (
                                <button
                                    onClick={handleConfirm}
                                    disabled={confirming}
                                    className="text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 px-4 py-1.5 rounded-md transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {confirming ? (
                                        <>
                                            <div className="w-2 h-2 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                            Executing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={10} />
                                            Execute
                                        </>
                                    )}
                                </button>
                            ) : (
                                <span className="text-[9px] text-neutral-600 uppercase tracking-widest">Signal expired</span>
                            )}
                        </div>
                    )}

                    {confirmed && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Order Placed
                        </span>
                    )}
                </div>

                {error && <p className="text-[10px] text-rose-400 mt-1">{error}</p>}
            </div>
        </div>
    );
};
