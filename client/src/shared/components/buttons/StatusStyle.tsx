const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Blocked: 'bg-red-500/10 text-red-400 border border-red-500/20',
    Pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    Verified: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    Rejected: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
};

export const StatusBadge = ({ status }: { status: keyof typeof statusStyles }) => (
    <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[status]}`}>
        {status}
    </span>
);