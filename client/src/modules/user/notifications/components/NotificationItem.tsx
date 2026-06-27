import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, AlertTriangle, Zap, Activity, Info, Clock } from 'lucide-react';
import { isAxiosError } from 'axios';
import { AlgoTradingApiService } from '@shared/services/stock/algo-trading-api';
import type { Notification } from '../types/notification.types';

interface NotificationItemProps {
    notif: Notification;
    onMarkAsRead: (id: string, e?: React.MouseEvent) => void;
}

/** Returns seconds remaining until expiresAt, or 0 if expired / not set */
const useSignalCountdown = (expiresAt?: string | Date): number => {
    const getSecondsLeft = () => {
        if (!expiresAt) return 0;
        const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
        return Math.max(0, diff);
    };

    const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);

    useEffect(() => {
        if (!expiresAt) return;
        if (getSecondsLeft() <= 0) return;

        const interval = setInterval(() => {
            const left = getSecondsLeft();
            setSecondsLeft(left);
            if (left <= 0) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expiresAt]);

    return secondsLeft;
};

const formatCountdown = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

export const NotificationItem = ({ notif, onMarkAsRead }: NotificationItemProps) => {
    const [confirming, setConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Resolve expiresAt from top-level or nested data field
    const expiresAt = notif.expiresAt ?? notif.data?.expiresAt;
    const signalId   = notif.signalId  ?? notif.data?.signalId;

    const secondsLeft  = useSignalCountdown(expiresAt);
    const isExpired    = expiresAt ? secondsLeft <= 0 : !signalId; // fallback: treat missing signalId as expired
    const isUrgent     = secondsLeft > 0 && secondsLeft <= 60;     // last 60 s — highlight in amber

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
        // Guard against double clicks or repeated executions
        if (confirming || confirmed) return;
        e.stopPropagation();
        const action = (notif.data?.action || extractAction(notif.message)) as 'BUY' | 'SELL';
        const symbol = (notif.data?.symbol || extractSymbol(notif.message)) as string;

        if (!action || !symbol) { setError('Cannot parse signal details'); return; }

        setConfirming(true);
        setError(null);
        try {
            await AlgoTradingApiService.confirmSignal({
                signalId: signalId!,
                symbol,
                action,
                quantity: 1,
            });
            setConfirmed(true);
            onMarkAsRead(notif.id);
        } catch (err: unknown) {
            // Extract the actual server error message (e.g. "Market is currently closed")
            // falling back to a generic message if none is present
            const serverMessage =
                isAxiosError(err)
                    ? (err.response?.data?.message ?? err.message)
                    : err instanceof Error
                        ? err.message
                        : null;
            setError(serverMessage || 'Order failed. Please try again.');
        } finally {
            setConfirming(false);
        }
    };

    const isAlgo = notif.type === 'ALGO_SIGNAL';

    return (
        <div
            onClick={(e) => !notif.read && onMarkAsRead(notif.id, e as React.MouseEvent)}
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

                <p className={`text-xs leading-relaxed mb-2 ${notif.read ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {notif.message}
                </p>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-widest">
                        {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>

                    {isAlgo && !notif.read && !confirmed && (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            {!isExpired ? (
                                <div className="flex items-center gap-1.5">
                                    {/* Live countdown badge */}
                                    <span className={`flex items-center gap-0.5 text-[9px] font-bold tabular-nums ${
                                        isUrgent ? 'text-amber-400' : 'text-neutral-500'
                                    }`}>
                                        <Clock size={8} />
                                        {formatCountdown(secondsLeft)}
                                    </span>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={confirming || confirmed}
                                        className={`text-xs font-bold px-4 py-1.5 rounded-md border transition-all disabled:opacity-50 flex items-center gap-2 ${
                                            isUrgent
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                                                : 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20'
                                        }`}
                                    >
                                        {confirming ? (
                                            <>
                                                <div className={`w-2 h-2 border-2 border-t-transparent rounded-full animate-spin ${
                                                    isUrgent ? 'border-amber-400' : 'border-purple-400'
                                                }`} />
                                                Executing...
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={10} />
                                                Execute
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <span className="text-xs text-neutral-600 uppercase tracking-widest">Signal expired</span>
                            )}
                        </div>
                    )}

                    {confirmed && (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Order Placed
                        </span>
                    )}
                </div>

                {error && (
                    <p className="text-xs text-rose-400 mt-2 flex items-start gap-1 leading-relaxed">
                        <AlertTriangle size={10} className="flex-shrink-0 mt-[1px]" />
                        <span>{error}</span>
                    </p>
                )}
            </div>
        </div>
    );
};
