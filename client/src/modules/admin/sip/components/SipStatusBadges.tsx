import type { SipStatus, InstallmentStatus } from '../types/SipTypes';

export const SipStatusBadge = ({ status }: { status: SipStatus }) => {
    const styles = {
        ACTIVE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        PAUSED: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        CANCELLED: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[status]}`}>
            {status}
        </span>
    );
};

export const InstallmentStatusBadge = ({ status }: { status: InstallmentStatus }) => {
    const styles = {
        ALLOCATED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        PAYMENT_SUCCESS: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        PENDING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        FAILED: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[status]}`}>
            {status}
        </span>
    );
};
