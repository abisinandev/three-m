export const formatCurrency = (val?: number) => `₹${(val || 0).toLocaleString('en-IN')}`;

export const getHealthScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
    if (score >= 60) return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
    return { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' };
};
