import { CheckCircle, Clock, XCircle } from "lucide-react";

export const PaymentStatusBadge = ({ status }: { status: string }) => {
    const s = status?.toUpperCase();

    if (s === "SUCCESSFUL")
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[11px] font-bold uppercase tracking-wider">
                <CheckCircle size={10} />
                Success
            </span>
        );
    
    if (s === "FAILED")
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[11px] font-bold uppercase tracking-wider">
                <XCircle size={10} />
                Failed
            </span>
        );

    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[11px] font-bold uppercase tracking-wider">
            <Clock size={10} />
            Pending
        </span>
    );
};
