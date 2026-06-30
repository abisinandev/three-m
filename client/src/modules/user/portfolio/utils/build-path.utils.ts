export function buildPath(pts: { x: number; y: number }[]) {
    if (!pts.length) return { line: '', area: '' };
    let line = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * 0.5;
        line += ` C ${cp1x} ${pts[i - 1].y}, ${cp1x} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    const bottomY = pts[0].y > pts[pts.length - 1].y ? pts[0].y + 20 : pts[pts.length - 1].y + 20;
    const area = `${line} L ${pts[pts.length - 1].x} ${bottomY} L ${pts[0].x} ${bottomY} Z`;
    return { line, area };
}


export const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export const fmtShort = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)}Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)}L`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
    return `₹${n.toFixed(0)}`;
};