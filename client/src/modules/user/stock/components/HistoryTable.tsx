import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, XCircle } from "lucide-react";

export const SideTag: React.FC<{ side?: string }> = ({ side }) => {
    const isSell = side?.toLowerCase() === 'sell';
    return (
        <div className={`inline-flex items-center gap-1 text-xs font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${isSell ? 'bg-red-500/10 text-[#FF1744] border-red-500/20' : 'bg-emerald-500/10 text-[#00C853] border-emerald-500/20'}`}>
            {isSell ? <ArrowUpRight size={10} /> : <ArrowDownLeft size={10} />}
            {side || '—'}
        </div>
    );
};

export const OrderTypeBadge: React.FC<{ type?: string; isAlgo?: boolean }> = ({ type, isAlgo }) => {
    if (!type) return null;
    return (
        <div className="inline-flex items-center gap-1 flex-wrap">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider bg-[#5a5f6e]/15 text-[#9ca3af] border-[#5a5f6e]/20">
                {type.replace('_', ' ')}
            </span>
            {isAlgo && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider bg-[#2962ff]/15 text-[#2962ff] border-[#2962ff]/20">
                    ALGO
                </span>
            )}
        </div>
    );
};

export const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
    const s = status?.toUpperCase() || 'PENDING';
    let color = '#ffab00'; // Amber
    let bg = 'rgba(255,171,0,0.12)';
    let border = '1px solid rgba(255,171,0,0.2)';
    let icon = <Clock size={9} />;

    if (s === 'FILLED') {
        color = '#00C853'; // Emerald
        bg = 'rgba(0,200,83,0.12)';
        border = '1px solid rgba(0,200,83,0.2)';
        icon = <CheckCircle2 size={9} />;
    } else if (s === 'CANCELLED' || s === 'REJECTED') {
        color = '#FF1744'; // Rose
        bg = 'rgba(255,23,68,0.12)';
        border = '1px solid rgba(255,23,68,0.2)';
        icon = <XCircle size={9} />;
    }

    return (
        <div className={`inline-flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider`}
            style={{ color, background: bg, border }}>
            {icon}
            {s}
        </div>
    );
};