import React from 'react';
import { ChevronRight, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, getPnlColor, getStatusStyle } from '../utils/portfolio.utils';
import type { IInvestmentResponse } from '@shared/types/portfolio.types';

interface DetailRowProps {
    k: string;
    v: string;
    vc?: string;
}

const DetailRow = ({ k, v, vc }: DetailRowProps) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="text-xs text-[#5a5f6e]">{k}</span>
        <span className="text-xs font-semibold tabular-nums" style={{ color: vc || '#e8eaed' }}>{v}</span>
    </div>
);

interface DetailGroupProps {
    label: string;
    children: React.ReactNode;
}

const DetailGroup = ({ label, children }: DetailGroupProps) => (
    <div>
        <p className="text-xs font-bold text-[#5a5f6e] uppercase tracking-widest mb-2 mt-0">
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
    inv: IInvestmentResponse;
    isLast: boolean;
    isExpanded: boolean;
    onExpand: (id: string | null) => void;
    onNavigate: (symbol: string) => void;
    returnType: 'Absolute' | 'XIRR';
}

export const HoldingsTableRow = ({
    inv,
    isLast,
    isExpanded,
    onExpand,
    onNavigate,
    returnType,
}: HoldingsTableRowProps) => {
    const profit = inv.profit ?? 0;

    const isStock =
        inv.assetType === 'STOCK' ||
        inv.investmentType?.toUpperCase() === 'STOCK' ||
        inv.category?.toLowerCase() === 'stock';

    const isMF = !isStock;
    const statusStyle = getStatusStyle(inv.status);
    const itemId = (inv.id || inv.schemeCode) as string;

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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <AssetLogo logo={inv.logo} name={inv.schemeName || inv.schemeCode} />

                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <p className="text-sm font-semibold text-[#e8eaed] m-0 overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: isStock ? 160 : 220 }}>
                                {isStock
                                    ? (inv.schemeCode || inv.symbol || '—')
                                    : (inv.schemeName || inv.schemeCode || '—')
                                }
                            </p>

                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${isStock ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                                {isStock ? 'EQ' : 'MF'}
                            </span>

                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0" style={{ borderColor: statusStyle.border, background: statusStyle.bg, color: statusStyle.color }}>
                                {inv.status || '—'}
                            </span>
                        </div>

                        {/* Subtitle */}
                        <p className="text-xs text-[#5a5f6e] m-0 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-[240px]">
                            {isStock
                                ? (inv.schemeName || inv.name || inv.schemeCode || '—') // Full company name as subtitle
                                : `${inv.schemeCode ? inv.schemeCode + ' · ' : ''}${inv.category || '—'}`
                            }
                        </p>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    {isStock ? (
                        <>
                            <p className="text-sm font-semibold text-[#e8eaed] m-0 tabular-nums">
                                {quantity} <span className="text-xs text-[#5a5f6e]">qty</span>
                            </p>
                            <p className="text-xs text-[#9ca3af] m-0 mt-0.5 tabular-nums">
                                Avg ₹{formatCurrency(avgPrice, 2)}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-[#e8eaed] m-0 tabular-nums">₹{formatCurrency(investedAmount, 2)}</p>
                            {quantity > 0 && (
                                <p className="text-xs text-[#5a5f6e] m-0 mt-0.5 tabular-nums">
                                    {Number(quantity).toFixed(3)} units
                                </p>
                            )}
                        </>
                    )}
                </div>

                <div style={{ textAlign: 'right' }}>
                    <p className="text-sm font-semibold text-[#e8eaed] m-0 tabular-nums">
                        ₹{formatCurrency(currentValue, 2)}
                    </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    {returnType === 'Absolute' ? (
                        <>
                            <p className="text-sm font-bold m-0 tabular-nums" style={{ color: pnlColor }}>
                                {profit >= 0 ? '+' : ''}₹{formatCurrency(Math.abs(profit), 2)}
                            </p>
                            <p className="text-xs m-0 mt-0.5 tabular-nums opacity-85" style={{ color: pnlColor }}>
                                {profit >= 0 ? '+' : ''}{profitPct.toFixed(2)}%
                            </p>
                        </>
                    ) : (
                        inv.xirr !== undefined ? (
                            <p className="text-sm font-bold m-0 tabular-nums" style={{ color: inv.xirr >= 0 ? '#00C853' : '#FF1744' }}>
                                {(inv.xirr * 100).toFixed(2)}%
                            </p>
                        ) : (
                            <>
                                <p className="text-sm font-bold m-0 tabular-nums" style={{ color: pnlColor }}>
                                    {profit >= 0 ? '+' : ''}{profitPct.toFixed(2)}%
                                </p>
                                <p className="text-[10px] text-[#5a5f6e] m-0 mt-0.5 uppercase">ABS</p>
                            </>
                        )
                    )}
                </div>

                <div style={{ textAlign: 'right' }}>
                    {isStock ? (
                        <>
                            <p className="text-sm font-semibold text-[#e8eaed] m-0 tabular-nums">
                                {ltp ? `₹${formatCurrency(ltp, 2)}` : '—'}
                            </p>
                            {profit !== 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
                                    {profit >= 0
                                        ? <TrendingUp size={12} color="#00C853" />
                                        : <TrendingDown size={12} color="#FF1744" />
                                    }
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-[#9ca3af] m-0 tabular-nums">
                                {ltp ? `₹${formatCurrency(ltp, 2)}` : '—'}
                            </p>
                            {inv.navDate && (
                                <p className="text-xs text-[#5a5f6e] m-0 mt-0.5 tabular-nums">
                                    {new Date(inv.navDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </p>
                            )}
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {isStock
                        ? <ArrowUpRight size={13} color="#5a5f6e" />
                        : <ChevronRight size={13} color="#5a5f6e" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    }
                </div>
            </div>

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
                        <DetailRow k="NAV" v={ltp ? `₹${formatCurrency(ltp, 2)}` : '—'} />
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
