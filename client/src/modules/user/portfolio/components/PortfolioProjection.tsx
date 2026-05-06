import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { getPortfolioProjection } from '@/shared/services/portfolio/portfolio-api';
import type { IPortfolioProjectionResponse } from '@shared/types/portfolio.types';

const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)}Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)}L`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
    return `₹${n.toFixed(0)}`;
};

function buildPath(pts: { x: number; y: number }[]) {
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

export function PortfolioProjection() {
    const [returnRate, setReturnRate] = useState(12);
    const [years, setYears] = useState(10);
    const [data, setData] = useState<IPortfolioProjectionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getPortfolioProjection(returnRate, years);
                setData(result);
            } catch (e: any) {
                setError(e?.response?.data?.message || 'Failed to load projection.');
            } finally {
                setIsLoading(false);
            }
        }, 500);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [returnRate, years]);

    const breakdown = data?.yearlyBreakdown ?? [];
    const VW = 300, VH = 100;
    const PAD = { t: 8, b: 16, l: 4, r: 4 };
    const cW = VW - PAD.l - PAD.r;
    const cH = VH - PAD.t - PAD.b;

    const vals = breakdown.map(b => b.value);
    const minV = vals.length ? Math.min(...vals) * 0.98 : 0;
    const maxV = vals.length ? Math.max(...vals) : 1;

    const pts = breakdown.map((b, i) => ({
        x: PAD.l + (i / Math.max(breakdown.length - 1, 1)) * cW,
        y: PAD.t + cH - ((b.value - minV) / (maxV - minV)) * cH,
    }));

    const { line: linePath, area: areaPath } = buildPath(pts);
    const hPt = hoveredIdx !== null ? pts[hoveredIdx] : null;
    const hData = hoveredIdx !== null ? breakdown[hoveredIdx] : null;
    const isProfit = (data?.projectedProfit ?? 0) >= 0;

    // Y-axis grid values
    const gridValues = [0, 0.25, 0.5, 0.75, 1].map(r => minV + r * (maxV - minV));

    return (
        <div style={{ background: '#0c0d0f', border: '1px solid #1e2025', borderRadius: 6 }}>

            {/* Title bar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderBottom: '1px solid #1a1c20',
            }}>
                <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#c9cdd4', letterSpacing: '-0.1px' }}>
                        Portfolio Projection
                    </span>
                    <span style={{
                        marginLeft: 8, fontSize: 9, color: '#4a5162',
                        background: '#161820', border: '1px solid #23262e',
                        padding: '1px 6px', borderRadius: 3,
                    }}>
                        ALL ASSETS
                    </span>
                </div>
                {isLoading && <Loader2 size={12} color="#5a5f70" style={{ animation: 'spin 1s linear infinite' }} />}
            </div>

            {/* Inputs */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #1a1c20', display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Return rate */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <label style={{ fontSize: 10, color: '#5a5f70', fontWeight: 500 }}>Expected Returns</label>
                        <span style={{ fontSize: 10, color: '#c9cdd4', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                            {returnRate}%&nbsp;<span style={{ color: '#4a5162', fontWeight: 400 }}>p.a.</span>
                        </span>
                    </div>
                    <div style={{ position: 'relative', height: 4, background: '#1e2025', borderRadius: 2 }}>
                        <div style={{
                            position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 2,
                            width: `${((returnRate - 1) / 49) * 100}%`,
                            background: '#387ed1',
                        }} />
                        <input
                            type="range" min={1} max={50} step={1} value={returnRate}
                            onChange={e => setReturnRate(Number(e.target.value))}
                            style={{
                                position: 'absolute', inset: 0, width: '100%', height: '100%',
                                opacity: 0, cursor: 'pointer', margin: 0,
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                        <span style={{ fontSize: 8, color: '#2e3140' }}>1%</span>
                        <span style={{ fontSize: 8, color: '#2e3140' }}>50%</span>
                    </div>
                </div>

                {/* Time horizon */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <label style={{ fontSize: 10, color: '#5a5f70', fontWeight: 500 }}>Time Period</label>
                        <span style={{ fontSize: 10, color: '#c9cdd4', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                            {years}&nbsp;<span style={{ color: '#4a5162', fontWeight: 400 }}>{years === 1 ? 'Year' : 'Years'}</span>
                        </span>
                    </div>
                    <div style={{ position: 'relative', height: 4, background: '#1e2025', borderRadius: 2 }}>
                        <div style={{
                            position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 2,
                            width: `${((years - 1) / 29) * 100}%`,
                            background: '#387ed1',
                        }} />
                        <input
                            type="range" min={1} max={30} step={1} value={years}
                            onChange={e => setYears(Number(e.target.value))}
                            style={{
                                position: 'absolute', inset: 0, width: '100%', height: '100%',
                                opacity: 0, cursor: 'pointer', margin: 0,
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                        <span style={{ fontSize: 8, color: '#2e3140' }}>1Y</span>
                        <span style={{ fontSize: 8, color: '#2e3140' }}>30Y</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #1a1c20', position: 'relative' }}>
                {isLoading ? (
                    <div style={{
                        height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#2e3140', fontSize: 10,
                    }}>
                        <Loader2 size={16} color="#387ed1" style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} />
                        Computing…
                    </div>
                ) : error ? (
                    <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e05252', fontSize: 10 }}>
                        {error}
                    </div>
                ) : breakdown.length > 0 ? (
                    <div style={{ position: 'relative' }}>
                        {/* Tooltip */}
                        {hData && hPt && (
                            <div style={{
                                position: 'absolute',
                                left: `${(hPt.x / VW) * 100}%`,
                                top: 0,
                                transform: 'translateX(-50%)',
                                background: '#161820',
                                border: '1px solid #23262e',
                                borderRadius: 4, padding: '4px 8px',
                                zIndex: 10, pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                            }}>
                                <div style={{ fontSize: 8, color: '#4a5162', marginBottom: 1 }}>Year {hData.year}</div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#c9cdd4', fontVariantNumeric: 'tabular-nums' }}>
                                    {fmtShort(hData.value)}
                                </div>
                            </div>
                        )}

                        <svg
                            ref={svgRef}
                            viewBox={`0 0 ${VW} ${VH}`}
                            preserveAspectRatio="none"
                            style={{ width: '100%', height: 110, display: 'block', cursor: 'crosshair' }}
                            onMouseMove={e => {
                                const rect = svgRef.current?.getBoundingClientRect();
                                if (!rect || !breakdown.length) return;
                                const xRatio = (e.clientX - rect.left) / rect.width;
                                const idx = Math.round(xRatio * (breakdown.length - 1));
                                setHoveredIdx(Math.max(0, Math.min(breakdown.length - 1, idx)));
                            }}
                            onMouseLeave={() => setHoveredIdx(null)}
                        >
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#387ed1" stopOpacity="0.12" />
                                    <stop offset="100%" stopColor="#387ed1" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Y grid */}
                            {[0.25, 0.5, 0.75].map((r, i) => (
                                <line key={i}
                                    x1={PAD.l} y1={PAD.t + cH * (1 - r)}
                                    x2={VW - PAD.r} y2={PAD.t + cH * (1 - r)}
                                    stroke="#1e2025" strokeWidth="0.6"
                                />
                            ))}

                            {/* Y axis labels */}
                            {[0, 0.5, 1].map((r, i) => {
                                const val = minV + r * (maxV - minV);
                                const y = PAD.t + cH * (1 - r);
                                return (
                                    <text key={i}
                                        x={PAD.l} y={y - 1}
                                        fontSize="5" fill="#2e3140"
                                        textAnchor="start"
                                    >
                                        {fmtShort(val)}
                                    </text>
                                );
                            })}

                            {/* Area */}
                            <path d={areaPath} fill="url(#areaGrad)" />

                            {/* Line */}
                            <path d={linePath} fill="none" stroke="#387ed1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />

                            {/* Hover indicator */}
                            {hPt && (
                                <>
                                    <line
                                        x1={hPt.x} y1={PAD.t}
                                        x2={hPt.x} y2={VH - PAD.b}
                                        stroke="#2e3140" strokeWidth="0.8" strokeDasharray="2,3"
                                    />
                                    <circle cx={hPt.x} cy={hPt.y} r="2.5" fill="#387ed1" stroke="#0c0d0f" strokeWidth="1.5" />
                                </>
                            )}
                        </svg>

                        {/* X labels */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            {[breakdown[0], breakdown[Math.floor(breakdown.length / 2)], breakdown[breakdown.length - 1]]
                                .filter(Boolean)
                                .map((b, i) => (
                                    <span key={i} style={{ fontSize: 8, color: '#2e3140', fontVariantNumeric: 'tabular-nums' }}>
                                        {i === 1 ? `Yr ${b.year}` : `Yr ${b.year}`}
                                    </span>
                                ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e3140', fontSize: 10 }}>
                        No portfolio data
                    </div>
                )}
            </div>

            {/* Stats */}
            {!isLoading && data && breakdown.length > 0 && (
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 0 }}>

                    {/* Row: Invested */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #161820' }}>
                        <span style={{ fontSize: 10, color: '#5a5f70' }}>Current Value</span>
                        <span style={{ fontSize: 10, color: '#c9cdd4', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                            {fmt(data.futureTotalInvestment)}
                        </span>
                    </div>

                    {/* Row: Projected */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #161820' }}>
                        <span style={{ fontSize: 10, color: '#5a5f70' }}>Projected in {years}Y</span>
                        <span style={{ fontSize: 10, color: '#c9cdd4', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                            {fmt(data.projectedValue)}
                        </span>
                    </div>

                    {/* Row: Gain */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0' }}>
                        <span style={{ fontSize: 10, color: '#5a5f70' }}>Est. Gain</span>
                        <span style={{
                            fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                            color: isProfit ? '#1db954' : '#e05252',
                        }}>
                            {isProfit ? '+' : ''}{fmt(data.projectedProfit)}
                        </span>
                    </div>
                </div>
            )}

            <div style={{ padding: '0 14px 10px', borderTop: '1px solid #161820' }}>
                <p style={{ fontSize: 8, color: '#2e3140', margin: '8px 0 0', lineHeight: 1.6 }}>
                    Projections are illustrative. Not investment advice.
                </p>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

