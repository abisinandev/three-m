import React from 'react';
import { ChevronRight, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, getPnlColor, getStatusStyle } from '../utils/portfolio.utils';
import { formatDateTime } from '@utils/date-converter/DateConverter';

interface DetailRowProps {
    k: string;
    v: string;
    vc?: string;
}

const DetailRow = ({ k, v, vc }: DetailRowProps) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#5a5f6e' }}>{k}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: vc || '#e8eaed' }}>{v}</span>
    </div>
);

interface DetailGroupProps {
    label: string;
    children: React.ReactNode;
}

const DetailGroup = ({ label, children }: DetailGroupProps) => (
    <div>
        <p style={{ fontSize: 9, fontWeight: 700, color: '#5a5f6e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, margin: '0 0 8px' }}>
            {label}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {children}
        </div>
    </div>
);

const AssetLogo = ({ logo, name }: { logo?: string; name?: string }) => (
    <div style={{
        width: 32, height: 32, borderRadius: 6,
        background: '#1e2025', border: '1px solid #272b33',
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
    }}>
        {logo ? (
            <img
                src={logo}
                alt=""
                style={{ width: 22, height: 22, objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
        ) : (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#5a5f6e' }}>
                {(name || '?').slice(0, 2).toUpperCase()}
            </span>
        )}
    </div>
);

interface HoldingsTableRowProps {
    inv: any;
    idx: number;
    isLast: boolean;
    isExpanded: boolean;
    onExpand: (id: string | null) => void;
    onNavigate: (symbol: string) => void;
    returnType: 'Absolute' | 'XIRR';
    activeTab?: string;
}

export const HoldingsTableRow = ({
    inv,
    idx,
    isLast,
    isExpanded,
    onExpand,
    onNavigate,
    returnType,
    activeTab = 'all',
}: HoldingsTableRowProps) => {
    const profit = inv.profit ?? 0;

    // Reliable isStock detection: checks assetType (from API), investmentType, and category
    const isStock =
        inv.assetType === 'STOCK' ||
        inv.investmentType?.toUpperCase() === 'STOCK' ||
        inv.category?.toLowerCase() === 'stock';

    const isMF = !isStock;
    const statusStyle = getStatusStyle(inv.status);
    const itemId = (inv.id || inv.schemeCode) as string;

    // Stock-specific values
    const quantity = inv.units ?? inv.quantity ?? 0;
    const avgPrice = isMF ? (inv.nav || inv.avgPrice || 0) : (inv.avgPrice || (inv.amount && quantity ? inv.amount / quantity : 0));
    const ltp = isStock ? (inv.currentPrice || inv.nav || avgPrice) : (inv.nav || inv.avgPrice || 0);
    const investedAmount = inv.amount ?? inv.investedAmount ?? 0;
    const currentValue = inv.currentValue ?? (investedAmount + profit);
    const profitPct = inv.profitPercentage ?? (investedAmount > 0 ? (profit / investedAmount) * 100 : 0);

    const handleRowClick = () => {
        if (isStock && inv.schemeCode) {
            onNavigate(inv.schemeCode);
        } else {
            onExpand(isExpanded ? null : itemId);
        }
    };

    const rowBg = isExpanded ? '#16181c' : 'transparent';
    const pnlColor = getPnlColor(profit);

    return (
        <div>
            {/* ─── Main Row ─── */}
            <div
                onClick={handleRowClick}
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 100px 110px 120px 110px 14px',
                    gap: 8,
                    padding: '11px 16px',
                    borderBottom: isLast ? 'none' : '1px solid #1a1c20',
                    cursor: 'pointer',
                    background: rowBg,
                    transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = '#13151a'; }}
                onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
                {/* Column 1: Instrument Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <AssetLogo logo={inv.logo} name={inv.schemeName || inv.schemeCode} />

                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <p style={{
                                fontSize: 13, fontWeight: 600, color: '#e8eaed',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                maxWidth: isStock ? 160 : 220, margin: 0,
                            }}>
                                {isStock
                                    ? (inv.schemeCode || inv.symbol || '—')
                                    : (inv.schemeName || inv.schemeCode || '—')
                                }
                            </p>

                            {/* Asset type badge */}
                            <span style={{
                                fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 3,
                                background: isStock ? 'rgba(99,179,237,0.1)' : 'rgba(167,139,250,0.1)',
                                color: isStock ? '#63b3ed' : '#a78bfa',
                                border: isStock ? '1px solid rgba(99,179,237,0.2)' : '1px solid rgba(167,139,250,0.2)',
                                textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
                            }}>
                                {isStock ? 'EQ' : 'MF'}
                            </span>

                            {/* Status badge */}
                            <span style={{
                                fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 3,
                                border: `1px solid ${statusStyle.border}`, background: statusStyle.bg,
                                color: statusStyle.color, textTransform: 'uppercase', letterSpacing: '0.04em',
                                flexShrink: 0,
                            }}>
                                {inv.status || '—'}
                            </span>
                        </div>

                        {/* Subtitle */}
                        <p style={{ fontSize: 10, color: '#5a5f6e', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 240 }}>
                            {isStock
                                ? (inv.schemeName || inv.name || inv.schemeCode || '—') // Full company name as subtitle
                                : `${inv.schemeCode ? inv.schemeCode + ' · ' : ''}${inv.category || '—'}`
                            }
                        </p>
                    </div>
                </div>

                {/* Column 2: Qty & Avg (stocks) OR Invested (MF) */}
                <div style={{ textAlign: 'right' }}>
                    {isStock ? (
                        <>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#e8eaed', margin: 0 }}>
                                {quantity} <span style={{ fontSize: 10, color: '#5a5f6e' }}>qty</span>
                            </p>
                            <p style={{ fontSize: 10, color: '#9ca3af', margin: '2px 0 0' }}>
                                Avg ₹{formatCurrency(avgPrice, 2)}
                            </p>
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: 12, color: '#e8eaed', margin: 0 }}>₹{formatCurrency(investedAmount, 0)}</p>
                            {quantity > 0 && (
                                <p style={{ fontSize: 10, color: '#5a5f6e', margin: '2px 0 0' }}>
                                    {Number(quantity).toFixed(3)} units
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Column 3: Current Value */}
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#e8eaed', margin: 0 }}>
                        ₹{formatCurrency(currentValue, 2)}
                    </p>
                </div>

                {/* Column 4: P&L */}
                <div style={{ textAlign: 'right' }}>
                    {returnType === 'Absolute' ? (
                        <>
                            <p style={{ fontSize: 12, fontWeight: 700, margin: 0, color: pnlColor }}>
                                {profit >= 0 ? '+' : ''}₹{formatCurrency(Math.abs(profit), 1)}
                            </p>
                            <p style={{ fontSize: 10, color: pnlColor, margin: '1px 0 0', opacity: 0.85 }}>
                                {profit >= 0 ? '+' : ''}{profitPct.toFixed(2)}%
                            </p>
                        </>
                    ) : (
                        <p style={{
                            fontSize: 12, fontWeight: 700, margin: 0,
                            color: inv.xirr !== undefined ? (inv.xirr >= 0 ? '#00C853' : '#FF1744') : '#5a5f6e',
                        }}>
                            {inv.xirr !== undefined ? `${(inv.xirr * 100).toFixed(2)}%` : '—'}
                        </p>
                    )}
                </div>

                {/* Column 5: LTP (stocks) or NAV (MF) */}
                <div style={{ textAlign: 'right' }}>
                    {isStock ? (
                        <>
                            <p style={{ fontSize: 12, color: '#e8eaed', margin: 0, fontWeight: 600 }}>
                                {ltp ? `₹${formatCurrency(ltp, 2)}` : '—'}
                            </p>
                            {profit !== 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
                                    {profit >= 0
                                        ? <TrendingUp size={10} color="#00C853" />
                                        : <TrendingDown size={10} color="#FF1744" />
                                    }
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                {ltp ? `₹${formatCurrency(ltp, 4)}` : '—'}
                            </p>
                            {inv.navDate && (
                                <p style={{ fontSize: 10, color: '#5a5f6e', margin: '1px 0 0' }}>
                                    {new Date(inv.navDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Column 6: Action indicator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {isStock
                        ? <ArrowUpRight size={13} color="#5a5f6e" />
                        : <ChevronRight size={13} color="#5a5f6e" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    }
                </div>
            </div>

            {/* ─── Expanded MF Detail Panel ─── */}
            {isExpanded && isMF && (
                <div style={{
                    background: '#0e1014', borderBottom: '1px solid #1e2025',
                    padding: '14px 16px 14px 58px', display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
                }}>
                    <DetailGroup label="Fund Details">
                        <DetailRow k="Scheme" v={inv.schemeName || '—'} />
                        <DetailRow k="Category" v={inv.category || '—'} />
                        <DetailRow k="Type" v={inv.investmentType || 'MUTUAL_FUND'} />
                        <DetailRow k="Scheme Code" v={inv.schemeCode || '—'} />
                    </DetailGroup>

                    <DetailGroup label="Financials">
                        <DetailRow k="Invested" v={`₹${formatCurrency(investedAmount, 2)}`} />
                        <DetailRow k="Current Value" v={`₹${formatCurrency(currentValue, 2)}`} />
                        <DetailRow
                            k="P&L"
                            v={`${profit >= 0 ? '+' : ''}₹${formatCurrency(Math.abs(profit), 2)}`}
                            vc={pnlColor}
                        />
                        <DetailRow
                            k="Return"
                            v={`${profit >= 0 ? '+' : ''}${profitPct.toFixed(2)}%`}
                            vc={pnlColor}
                        />
                        {inv.xirr !== undefined && (
                            <DetailRow
                                k="XIRR"
                                v={`${(inv.xirr * 100).toFixed(2)}%`}
                                vc={inv.xirr >= 0 ? '#00C853' : '#FF1744'}
                            />
                        )}
                    </DetailGroup>

                    <DetailGroup label="Units & NAV">
                        <DetailRow k="Units Held" v={Number(quantity).toFixed(4)} />
                        <DetailRow k="NAV" v={ltp ? `₹${formatCurrency(ltp, 4)}` : '—'} />
                        <DetailRow
                            k="NAV Date"
                            v={inv.navDate
                                ? new Date(inv.navDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                : '—'
                            }
                        />
                        {inv.remainingUnits != null && (
                            <DetailRow k="Remaining Units" v={Number(inv.remainingUnits).toFixed(4)} />
                        )}
                    </DetailGroup>

                    <DetailGroup label="Timeline">
                        <DetailRow k="Invested On" v={formatDateTime(new Date(inv.createdAt))} />
                        <DetailRow
                            k="Holding Duration"
                            v={`${Math.floor((Date.now() - new Date(inv.createdAt).getTime()) / 86400000)} days`}
                        />
                        {inv.redeemedUnits && Number(inv.redeemedUnits) > 0 && (
                            <>
                                <DetailRow k="Redeemed Units" v={`${Number(inv.redeemedUnits).toFixed(4)}`} />
                                <DetailRow k="Redeemed ₹" v={`₹${formatCurrency(inv.redeemedAmount ?? 0, 2)}`} vc="#FF1744" />
                            </>
                        )}
                        <DetailRow k="Status" v={inv.status || '—'} />
                    </DetailGroup>
                </div>
            )}
        </div>
    );
};
