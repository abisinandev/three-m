import React from 'react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
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

interface HoldingsTableRowProps {
    inv: any;
    idx: number;
    isLast: boolean;
    isExpanded: boolean;
    onExpand: (id: string | null) => void;
    onNavigate: (symbol: string) => void;
    returnType: 'Absolute' | 'XIRR';
}

export const HoldingsTableRow = ({
    inv,
    idx,
    isLast,
    isExpanded,
    onExpand,
    onNavigate,
    returnType,
}: HoldingsTableRowProps) => {
    const profit = inv.profit ?? 0;
    const holdingValue = (inv.amount ?? 0) + profit;
    const isStock = inv.investmentType?.toLowerCase() === 'stock' || inv.category?.toLowerCase() === 'stock';
    const statusStyle = getStatusStyle(inv.status);
    const profitPct = inv.amount ? (profit / inv.amount) * 100 : 0;
    const itemId = (inv.id || inv.schemeCode) as string;

    return (
        <div key={itemId}>
            <div
                onClick={() => {
                    if (isStock && inv.schemeCode) {
                        onNavigate(inv.schemeCode);
                    } else {
                        onExpand(isExpanded ? null : itemId);
                    }
                }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 100px 110px 120px 110px 14px',
                    gap: 8,
                    padding: '11px 16px',
                    borderBottom: isLast ? 'none' : '1px solid #1a1c20',
                    cursor: 'pointer',
                    background: isExpanded ? '#16181c' : 'transparent',
                    transition: 'background 0.12s',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 6,
                        background: '#1e2025', border: '1px solid #272b33',
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden',
                    }}>
                        {inv.logo ? (
                            <img src={inv.logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                        ) : (
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#5a5f6e' }}>
                                {(inv.schemeName || inv.schemeCode || '?').slice(0, 2).toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <p style={{
                                fontSize: 13, fontWeight: 600, color: '#e8eaed',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                maxWidth: 220, margin: 0,
                            }}>
                                {inv.schemeName || inv.schemeCode || '—'}
                            </p>
                            <span style={{
                                fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 3,
                                border: `1px solid ${statusStyle.border}`, background: statusStyle.bg,
                                color: statusStyle.color, textTransform: 'uppercase', letterSpacing: '0.04em',
                                flexShrink: 0,
                            }}>
                                {inv.status || '—'}
                            </span>
                        </div>
                        <p style={{ fontSize: 10, color: '#5a5f6e', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                            {inv.schemeCode && inv.schemeCode !== inv.schemeName ? `${inv.schemeCode} · ` : ''}
                            {inv.category || inv.investmentType || '—'}
                            {inv.units ? ` · ${inv.units.toFixed(3)} units` : ''}
                        </p>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    {isStock ? (
                        <>
                            <p style={{ fontSize: 12, color: '#e8eaed', margin: 0 }}>{inv.units || 0} Qty</p>
                            <p style={{ fontSize: 10, color: '#9ca3af', margin: '2px 0 0' }}>
                                Avg: ₹{inv.amount && inv.units ? formatCurrency(inv.amount / inv.units, 2) : '0.00'}
                            </p>
                        </>
                    ) : (
                        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>₹{formatCurrency(inv.amount ?? 0, 0)}</p>
                    )}
                </div>

                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#e8eaed', margin: 0 }}>₹{formatCurrency(holdingValue, 2)}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    {returnType === 'Absolute' ? (
                        <>
                            <p style={{ fontSize: 12, fontWeight: 700, margin: 0, color: getPnlColor(profit) }}>
                                {profit >= 0 ? '+' : ''}₹{formatCurrency(Math.abs(profit), 1)}
                            </p>
                            <p style={{ fontSize: 10, color: getPnlColor(profit), margin: '1px 0 0', opacity: 0.85 }}>
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

                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{inv.nav ? `₹${inv.nav.toFixed(2)}` : '—'}</p>
                    {!isStock && inv.navDate && (
                        <p style={{ fontSize: 10, color: '#5a5f6e', margin: '1px 0 0' }}>
                            {new Date(inv.navDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {isStock ? <ArrowUpRight size={13} color="#5a5f6e" /> : (
                        <ChevronRight size={13} color="#5a5f6e" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    )}
                </div>
            </div>

            {isExpanded && !isStock && (
                <div style={{
                    background: '#0e1014', borderBottom: '1px solid #1e2025',
                    padding: '14px 16px 14px 58px', display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
                }}>
                    <DetailGroup label="Fund Details">
                        <DetailRow k="Scheme" v={inv.schemeName || '—'} />
                        <DetailRow k="Category" v={inv.category || '—'} />
                        <DetailRow k="Type" v={inv.investmentType || '—'} />
                    </DetailGroup>

                    <DetailGroup label="Financials">
                        <DetailRow k="Invested" v={`₹${formatCurrency(inv.amount ?? 0, 2)}`} />
                        <DetailRow k="P&L" v={`${profit >= 0 ? '+' : ''}₹${formatCurrency(Math.abs(profit), 2)}`} vc={getPnlColor(profit)} />
                        <DetailRow
                            k="XIRR"
                            v={inv.xirr !== undefined ? `${(inv.xirr * 100).toFixed(2)}%` : '—'}
                            vc={inv.xirr !== undefined ? (inv.xirr >= 0 ? '#00C853' : '#FF1744') : '#5a5f6e'}
                        />
                    </DetailGroup>

                    <DetailGroup label="Units & NAV">
                        <DetailRow k="Units" v={inv.units?.toFixed(4) || '—'} />
                        <DetailRow k="NAV" v={inv.nav ? `₹${inv.nav.toFixed(4)}` : '—'} />
                        <DetailRow
                            k="NAV Date"
                            v={inv.navDate ? new Date(inv.navDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        />
                    </DetailGroup>

                    <DetailGroup label="Timeline">
                        <DetailRow k="Invested on" v={formatDateTime(new Date(inv.createdAt))} />
                        <DetailRow k="Holding" v={`${Math.floor((Date.now() - new Date(inv.createdAt).getTime()) / 86400000)} days`} />
                        {inv.redeemedUnits && inv.redeemedUnits > 0 && (
                            <>
                                <DetailRow k="Redeemed Units" v={`${inv.redeemedUnits.toFixed(4)}`} />
                                <DetailRow k="Redeemed ₹" v={`₹${formatCurrency(inv.redeemedAmount ?? 0, 2)}`} vc="#FF1744" />
                            </>
                        )}
                    </DetailGroup>
                </div>
            )}
        </div>
    );
};
