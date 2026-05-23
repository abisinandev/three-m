export const formatCurrency = (v: number | string | undefined | null, digits = 2) => {
    if (v === undefined || v === null || isNaN(Number(v))) return '0.00';
    return Number(v).toLocaleString('en-IN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
};

export const getPnlColor = (v: number) => (v >= 0 ? '#00C853' : '#FF1744');

export const getStatusStyle = (status: string = '') => {
    const s = status.toLowerCase();
    if (['active', 'settled', 'credited', 'executed', 'allotted'].some(k => s.includes(k)))
        return { color: '#00C853', bg: 'rgba(0,200,83,0.1)', border: 'rgba(0,200,83,0.2)' };
    if (['pending', 'processing'].some(k => s.includes(k)))
        return { color: '#FFB300', bg: 'rgba(255,179,0,0.1)', border: 'rgba(255,179,0,0.2)' };
    if (['cancelled', 'rejected', 'failed', 'redeemed'].some(k => s.includes(k)))
        return { color: '#FF1744', bg: 'rgba(255,23,68,0.1)', border: 'rgba(255,23,68,0.2)' };
    return { color: '#5a5f6e', bg: 'rgba(90,95,110,0.1)', border: 'rgba(90,95,110,0.2)' };
};
