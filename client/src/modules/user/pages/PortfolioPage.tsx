'use client';
import React, { useState, useMemo } from 'react';
import {
    Search,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AssetAllocationDonut from '../components/PieChart';
import { Pagination } from '@shared/components/pagination/Pagination';
import {
    getPortfolioDatas,
    getPortfolioInvestments,
    getPortfolioProjection,
} from '@shared/services/feature/portfolio/PortfolioApi';
import type {
    IInvestmentBaseResponse,
    IPortfolioDatasResponse,
    IPortfolioProjectionResponse,
} from '@shared/types/portfolio.types';
import { formatDateTime } from '@utils/date-converter/DateConverter';
import { useNavigate } from '@tanstack/react-router';
import api from '@lib/axiosUser';
import { ROUTES } from '@shared/constants/routes';

const fmt = (v: number, digits = 2) =>
    v.toLocaleString('en-IN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });

const pnlColor = (v: number) =>
    v >= 0 ? '#00C853' : '#FF1744';


const getStatusStyle = (status: string = '') => {
    const s = status.toLowerCase();
    if (['active', 'settled', 'credited', 'executed', 'allotted'].some(k => s.includes(k)))
        return { color: '#00C853', bg: 'rgba(0,200,83,0.1)', border: 'rgba(0,200,83,0.2)' };
    if (['pending', 'processing'].some(k => s.includes(k)))
        return { color: '#FFB300', bg: 'rgba(255,179,0,0.1)', border: 'rgba(255,179,0,0.2)' };
    if (['cancelled', 'rejected', 'failed', 'redeemed'].some(k => s.includes(k)))
        return { color: '#FF1744', bg: 'rgba(255,23,68,0.1)', border: 'rgba(255,23,68,0.2)' };
    return { color: '#5a5f6e', bg: 'rgba(90,95,110,0.1)', border: 'rgba(90,95,110,0.2)' };
};

type Tab = 'all' | 'stocks' | 'mf';


const SummaryBar = ({
    currentValue,
    totalInvestment,
    totalProfit,
    profitPercentage,
    isLoading,
}: {
    currentValue: number;
    totalInvestment: number;
    totalProfit: number;
    profitPercentage: number;
    isLoading: boolean;
}) => {
    const positive = totalProfit >= 0;

    return (
        <div style={{
            background: '#111214',
            border: '1px solid #1e2025',
            borderRadius: 8,
            padding: '20px 24px',
        }}>
            {/* Total portfolio value */}
            <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: '#5a5f6e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                    Portfolio Value
                </p>
                {isLoading ? (
                    <div style={{ height: 36, width: 200, background: '#1e2025', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
                ) : (
                    <p style={{ fontSize: 30, fontWeight: 700, color: '#e8eaed', letterSpacing: '-0.5px', lineHeight: 1 }}>
                        ₹{fmt(currentValue, 2)}
                    </p>
                )}
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
                <StatCol
                    label="Invested"
                    value={`₹${fmt(totalInvestment, 0)}`}
                    sub=""
                    plain
                />
                <StatCol
                    label="Total Returns"
                    value={`${positive ? '+' : ''}₹${fmt(Math.abs(totalProfit), 2)}`}
                    sub={`${positive ? '+' : ''}${profitPercentage.toFixed(2)}%`}
                    positive={positive}
                    showArrow
                />
                <StatCol
                    label="Today's P&L"
                    value="—"
                    sub="—"
                    positive={undefined}
                />
            </div>
        </div>
    );
};

const StatCol = ({
    label,
    value,
    sub,
    positive,
    plain,
    showArrow,
}: {
    label: string;
    value: string;
    sub: string;
    positive?: boolean;
    plain?: boolean;
    showArrow?: boolean;
}) => {
    const color = plain
        ? '#e8eaed'
        : positive === undefined
            ? '#5a5f6e'
            : positive
                ? '#00C853'
                : '#FF1744';

    return (
        <div style={{ paddingLeft: plain ? 0 : 16, borderLeft: plain ? 'none' : '1px solid #1e2025' }}>
            <p style={{ fontSize: 10, color: '#5a5f6e', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                {label}
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: 4 }}>
                {showArrow && positive !== undefined && (
                    positive
                        ? <ArrowUpRight size={13} color="#00C853" />
                        : <ArrowDownRight size={13} color="#FF1744" />
                )}
                {value}
            </p>
            {sub && (
                <p style={{ fontSize: 10, color: positive === undefined ? '#5a5f6e' : color, marginTop: 2 }}>
                    {sub}
                </p>
            )}
        </div>
    );
};


const PortfolioDashboard = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [returnType, setReturnType] = useState<'Absolute' | 'XIRR'>('Absolute');

    const limit = 20;
    const navigate = useNavigate();

    /* queries */
    const { data: holdingsData, isLoading: isHoldingsLoading, isError, error: queryError } =
        useQuery<IInvestmentBaseResponse>({
            queryKey: ['portfolio', 'holdings', page, limit, status, search],
            queryFn: () => getPortfolioInvestments(page, limit, status, search),
            staleTime: 5 * 60 * 1000,
            placeholderData: (prev: any) => prev,
        });

    const { data: summaryData, isLoading: isSummaryLoading } =
        useQuery<IPortfolioDatasResponse>({
            queryKey: ['portfolio', 'summary'],
            queryFn: getPortfolioDatas,
            staleTime: 5 * 60 * 1000,
            placeholderData: (prev: any) => prev,
        });

    const { data: xirrData } = useQuery({
        queryKey: ['portfolio-key'],
        queryFn: async () => await api.get('/user/portfolio/return-xirr'),
    });

    const { data: projectionData, isLoading: isProjectionLoading } =
        useQuery<IPortfolioProjectionResponse>({
            queryKey: ['portfolio', 'projection'],
            queryFn: getPortfolioProjection,
            staleTime: 5 * 60 * 1000,
        });

    /* derived */
    const investments = holdingsData?.data || [];
    const totalCount = holdingsData?.totalCount ?? 0;

    const totalInvestment = summaryData?.totalInvestment ?? 0;
    const totalProfit = summaryData?.totalProfit ?? 0;
    const currentValue = summaryData?.currentValue ?? 0;
    const profitPercentage = summaryData?.profitPercentage ?? 0;
    const xirrValue = Number(xirrData?.data?.data).toFixed(2) || 0;

    const isLoading = isHoldingsLoading || isSummaryLoading;

    /* tab filtering */
    const filtered = useMemo(() => {
        if (activeTab === 'all') return investments;
        if (activeTab === 'stocks')
            return investments.filter(
                i => i.investmentType?.toLowerCase() === 'stock' || i.category?.toLowerCase() === 'stock'
            );
        return investments.filter(
            i => i.investmentType?.toLowerCase() !== 'stock' && i.category?.toLowerCase() !== 'stock'
        );
    }, [investments, activeTab]);

    const handlePageChange = (newPage: number) => {
        const maxPage = Math.ceil(totalCount / limit);
        if (newPage >= 1 && newPage <= maxPage) setPage(newPage);
    };

    const tabs: { id: Tab; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'stocks', label: 'Stocks' },
        { id: 'mf', label: 'Mutual Funds' },
    ];

    const tableHeaders = useMemo(() => {
        if (activeTab === 'stocks') {
            return ['Symbol', 'Qty & Avg Paid', 'Cur. Value', returnType === 'XIRR' ? 'XIRR' : 'P&L', 'LTP', ''];
        } else if (activeTab === 'mf') {
            return ['Scheme', 'Invested', 'Cur. Value', returnType === 'XIRR' ? 'XIRR' : 'P&L', 'NAV', ''];
        }
        return ['Instrument', 'Invested/Qty', 'Cur. Value', returnType === 'XIRR' ? 'XIRR' : 'P&L', 'NAV / LTP', ''];
    }, [activeTab, returnType]);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0b0c0e',
            color: '#e8eaed',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            paddingBottom: 48,
        }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', letterSpacing: '-0.2px', margin: 0 }}>
                            Portfolio
                        </h1>
                        <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0 }}>
                            Holdings & performance
                        </p>
                    </div>

                    {/* XIRR toggle */}
                    <div style={{
                        display: 'flex',
                        background: '#111214',
                        border: '1px solid #1e2025',
                        borderRadius: 6,
                        padding: 2,
                        gap: 2,
                    }}>
                        {(['Absolute', 'XIRR'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setReturnType(t)}
                                style={{
                                    padding: '4px 10px',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: '0.05em',
                                    borderRadius: 4,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    background: returnType === t ? '#1e2025' : 'transparent',
                                    color: returnType === t ? '#e8eaed' : '#5a5f6e',
                                }}
                            >
                                {t.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Summary banner ── */}
                <SummaryBar
                    currentValue={currentValue}
                    totalInvestment={totalInvestment}
                    totalProfit={totalProfit}
                    profitPercentage={profitPercentage}
                    isLoading={isLoading}
                />

                {/* ── Main layout ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>

                    {/* ── Left: holdings ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #1e2025', gap: 0 }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setPage(1); }}
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: 12,
                                        fontWeight: activeTab === tab.id ? 600 : 400,
                                        color: activeTab === tab.id ? '#e8eaed' : '#5a5f6e',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: activeTab === tab.id ? '2px solid #00C853' : '2px solid transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                        marginBottom: -1,
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search + filter row */}
                        <div style={{ display: 'flex', gap: 8 }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search
                                    size={12}
                                    color="#5a5f6e"
                                    style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
                                />
                                <input
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                                    placeholder="Search holdings..."
                                    style={{
                                        width: '100%',
                                        background: '#111214',
                                        border: '1px solid #1e2025',
                                        borderRadius: 6,
                                        padding: '7px 10px 7px 28px',
                                        fontSize: 12,
                                        color: '#e8eaed',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Filter
                                    size={12}
                                    color="#5a5f6e"
                                    style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
                                />
                                <select
                                    value={status || ''}
                                    onChange={e => { setStatus(e.target.value || null); setPage(1); }}
                                    style={{
                                        background: '#111214',
                                        border: '1px solid #1e2025',
                                        borderRadius: 6,
                                        padding: '7px 10px 7px 28px',
                                        fontSize: 12,
                                        color: '#e8eaed',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        minWidth: 130,
                                    }}
                                >
                                    <option value="" style={{ background: '#111214' }}>All Status</option>
                                    <option value="ALLOTTED" style={{ background: '#111214' }}>Allotted</option>
                                    <option value="INITIATED" style={{ background: '#111214' }}>Initiated</option>
                                    <option value="REDEEMED" style={{ background: '#111214' }}>Redeemed</option>
                                    <option value="FAILED" style={{ background: '#111214' }}>Failed</option>
                                </select>
                            </div>
                        </div>

                        {/* Holdings table */}
                        <div style={{
                            background: '#111214',
                            border: '1px solid #1e2025',
                            borderRadius: 8,
                            overflow: 'hidden',
                        }}>
                            {/* Table header */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 100px 110px 120px 110px 14px',
                                gap: 8,
                                padding: '8px 16px',
                                borderBottom: '1px solid #1e2025',
                            }}>
                                {tableHeaders.map((h, i) => (
                                    <p key={i} style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        color: '#5a5f6e',
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        textAlign: i > 0 ? 'right' : 'left',
                                        margin: 0,
                                    }}>{h}</p>
                                ))}
                            </div>

                            {/* Rows */}
                            {isLoading ? (
                                <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: '#5a5f6e' }}>
                                    Loading holdings…
                                </div>
                            ) : isError ? (
                                <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: '#FF1744' }}>
                                    Failed — {(queryError as Error)?.message || 'Unknown error'}
                                </div>
                            ) : filtered.length === 0 ? (
                                <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 12, color: '#5a5f6e' }}>
                                    {search ? 'No matching holdings' : 'No holdings yet'}
                                </div>
                            ) : (
                                <>
                                    {filtered.map((inv, idx) => {
                                        const profit = inv.profit ?? 0;
                                        const holdingValue = (inv.amount ?? 0) + profit;
                                        const isExpanded = expandedId === (inv.id || inv.schemeCode);
                                        const isStock = inv.investmentType?.toLowerCase() === 'stock'
                                            || inv.category?.toLowerCase() === 'stock';
                                        const statusStyle = getStatusStyle(inv.status);
                                        const profitPct = inv.amount
                                            ? (profit / inv.amount) * 100
                                            : 0;

                                        return (
                                            <div key={inv.id || inv.schemeCode}>
                                                {/* Row */}
                                                <div
                                                    onClick={() => {
                                                        if (isStock && inv.schemeCode) {
                                                            navigate({ to: `/user/trading/${inv.schemeCode}` });
                                                        } else {
                                                            setExpandedId(isExpanded ? null : (inv.id || inv.schemeCode) as string);
                                                        }
                                                    }}
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '1fr 100px 110px 120px 110px 14px',
                                                        gap: 8,
                                                        padding: '11px 16px',
                                                        borderBottom: idx < filtered.length - 1 ? '1px solid #1a1c20' : 'none',
                                                        cursor: 'pointer',
                                                        background: isExpanded ? '#16181c' : 'transparent',
                                                        transition: 'background 0.12s',
                                                    }}
                                                    onMouseEnter={e =>
                                                        !isExpanded && ((e.currentTarget as HTMLDivElement).style.background = '#13151a')
                                                    }
                                                    onMouseLeave={e =>
                                                        !isExpanded && ((e.currentTarget as HTMLDivElement).style.background = 'transparent')
                                                    }
                                                >
                                                    {/* Instrument */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                                        {/* Avatar */}
                                                        <div style={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: 6,
                                                            background: '#1e2025',
                                                            border: '1px solid #272b33',
                                                            flexShrink: 0,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
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
                                                                    fontSize: 13,
                                                                    fontWeight: 600,
                                                                    color: '#e8eaed',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    maxWidth: 220,
                                                                    margin: 0,
                                                                }}>
                                                                    {inv.schemeName || inv.schemeCode || '—'}
                                                                </p>
                                                                {/* Status pill */}
                                                                <span style={{
                                                                    fontSize: 9,
                                                                    fontWeight: 700,
                                                                    padding: '1px 6px',
                                                                    borderRadius: 3,
                                                                    border: `1px solid ${statusStyle.border}`,
                                                                    background: statusStyle.bg,
                                                                    color: statusStyle.color,
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.04em',
                                                                    flexShrink: 0,
                                                                }}>
                                                                    {inv.status || '—'}
                                                                </span>
                                                            </div>
                                                            <p style={{ fontSize: 10, color: '#5a5f6e', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                                                                {inv.schemeCode && inv.schemeCode !== inv.schemeName
                                                                    ? `${inv.schemeCode} · `
                                                                    : ''}
                                                                {inv.category || inv.investmentType || '—'}
                                                                {inv.units ? ` · ${inv.units.toFixed(3)} units` : ''}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Invested */}
                                                    <div style={{ textAlign: 'right' }}>
                                                        {isStock ? (
                                                            <>
                                                                <p style={{ fontSize: 12, color: '#e8eaed', margin: 0 }}>
                                                                    {inv.units || 0} Qty
                                                                </p>
                                                                <p style={{ fontSize: 10, color: '#9ca3af', margin: '2px 0 0' }}>
                                                                    Avg: ₹{inv.amount && inv.units ? fmt(inv.amount / inv.units, 2) : '0.00'}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                                                ₹{fmt(inv.amount ?? 0, 0)}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Current value */}
                                                    <div style={{ textAlign: 'right' }}>
                                                        <p style={{ fontSize: 12, fontWeight: 600, color: '#e8eaed', margin: 0 }}>
                                                            ₹{fmt(holdingValue, 2)}
                                                        </p>
                                                    </div>

                                                    {/* P&L or XIRR */}
                                                    <div style={{ textAlign: 'right' }}>
                                                        {returnType === 'Absolute' ? (
                                                            <>
                                                                <p style={{
                                                                    fontSize: 12,
                                                                    fontWeight: 700,
                                                                    margin: 0,
                                                                    color: pnlColor(profit),
                                                                }}>
                                                                    {profit >= 0 ? '+' : ''}₹{fmt(Math.abs(profit), 1)}
                                                                </p>
                                                                <p style={{ fontSize: 10, color: pnlColor(profit), margin: '1px 0 0', opacity: 0.85 }}>
                                                                    {profit >= 0 ? '+' : ''}{profitPct.toFixed(2)}%
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p style={{
                                                                fontSize: 12,
                                                                fontWeight: 700,
                                                                margin: 0,
                                                                color: inv.xirr !== undefined
                                                                    ? inv.xirr >= 0 ? '#00C853' : '#FF1744'
                                                                    : '#5a5f6e',
                                                            }}>
                                                                {inv.xirr !== undefined ? `${(inv.xirr * 100).toFixed(2)}%` : '—'}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* NAV/LTP */}
                                                    <div style={{ textAlign: 'right' }}>
                                                        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                                            {inv.nav ? `₹${inv.nav.toFixed(2)}` : '—'}
                                                        </p>
                                                        {!isStock && inv.navDate && (
                                                            <p style={{ fontSize: 10, color: '#5a5f6e', margin: '1px 0 0' }}>
                                                                {new Date(inv.navDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Chevron */}
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        {isStock ? (
                                                            <ArrowUpRight size={13} color="#5a5f6e" />
                                                        ) : (
                                                            <ChevronRight
                                                                size={13}
                                                                color="#5a5f6e"
                                                                style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expand panel — mutual funds only */}
                                                {isExpanded && !isStock && (
                                                    <div style={{
                                                        background: '#0e1014',
                                                        borderBottom: '1px solid #1e2025',
                                                        padding: '14px 16px 14px 58px',
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                                        gap: 24,
                                                    }}>
                                                        <DetailGroup label="Fund Details">
                                                            <DetailRow k="Scheme" v={inv.schemeName || '—'} />
                                                            <DetailRow k="Category" v={inv.category || '—'} />
                                                            <DetailRow k="Type" v={inv.investmentType || '—'} />
                                                        </DetailGroup>

                                                        <DetailGroup label="Financials">
                                                            <DetailRow k="Invested" v={`₹${fmt(inv.amount ?? 0, 2)}`} />
                                                            <DetailRow
                                                                k="P&L"
                                                                v={`${profit >= 0 ? '+' : ''}₹${fmt(Math.abs(profit), 2)}`}
                                                                vc={pnlColor(profit)}
                                                            />
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
                                                            <DetailRow
                                                                k="Holding"
                                                                v={`${Math.floor((Date.now() - new Date(inv.createdAt).getTime()) / 86400000)} days`}
                                                            />
                                                            {inv.redeemedUnits && inv.redeemedUnits > 0 ? (
                                                                <>
                                                                    <DetailRow k="Redeemed Units" v={`${inv.redeemedUnits.toFixed(4)}`} />
                                                                    <DetailRow k="Redeemed ₹" v={`₹${fmt(inv.redeemedAmount ?? 0, 2)}`} vc="#FF1744" />
                                                                </>
                                                            ) : (
                                                                <span style={{
                                                                    fontSize: 9,
                                                                    fontWeight: 700,
                                                                    color: '#00C853',
                                                                    background: 'rgba(0,200,83,0.08)',
                                                                    border: '1px solid rgba(0,200,83,0.2)',
                                                                    padding: '2px 8px',
                                                                    borderRadius: 3,
                                                                    letterSpacing: '0.04em',
                                                                    textTransform: 'uppercase',
                                                                    display: 'inline-block',
                                                                    marginTop: 4,
                                                                }}>
                                                                    Active
                                                                </span>
                                                            )}
                                                        </DetailGroup>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Totals footer row */}
                                    {filtered.length > 0 && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 100px 110px 120px 110px 14px',
                                            gap: 8,
                                            padding: '10px 16px',
                                            borderTop: '1px solid #1e2025',
                                            background: '#0e1014',
                                        }}>
                                            <p style={{ fontSize: 11, fontWeight: 600, color: '#5a5f6e', margin: 0 }}>
                                                {filtered.length} holding{filtered.length !== 1 ? 's' : ''}
                                            </p>
                                            <p style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: '#9ca3af', margin: 0 }}>
                                                ₹{fmt(filtered.reduce((s, i) => s + (i.amount ?? 0), 0), 0)}
                                            </p>
                                            <p style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: '#e8eaed', margin: 0 }}>
                                                ₹{fmt(filtered.reduce((s, i) => s + (i.amount ?? 0) + (i.profit ?? 0), 0), 0)}
                                            </p>
                                            <p style={{
                                                textAlign: 'right', fontSize: 11, fontWeight: 700, margin: 0,
                                                color: pnlColor(filtered.reduce((s, i) => s + (i.profit ?? 0), 0)),
                                            }}>
                                                {(() => {
                                                    const tot = filtered.reduce((s, i) => s + (i.profit ?? 0), 0);
                                                    return `${tot >= 0 ? '+' : ''}₹${fmt(Math.abs(tot), 1)}`;
                                                })()}
                                            </p>
                                            <p style={{ margin: 0 }} />
                                            <p style={{ margin: 0 }} />
                                        </div>
                                    )}
                                </>
                            )}

                            {!search && totalCount > 0 && (
                                <div style={{ borderTop: '1px solid #1e2025' }}>
                                    <Pagination
                                        page={page}
                                        limit={limit}
                                        total={totalCount}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right sidebar ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        {/* XIRR metric card */}
                        <div style={{
                            background: '#111214',
                            border: '1px solid #1e2025',
                            borderRadius: 8,
                            padding: '14px 16px',
                        }}>
                            <p style={{ fontSize: 10, color: '#5a5f6e', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4, margin: '0 0 4px' }}>
                                Portfolio XIRR
                            </p>
                            <p style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: Number(xirrValue) >= 0 ? '#00C853' : '#FF1744',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}>
                                {Number(xirrValue) >= 0
                                    ? <TrendingUp size={16} color="#00C853" />
                                    : <TrendingDown size={16} color="#FF1744" />
                                }
                                {xirrValue}%
                            </p>
                            <p style={{ fontSize: 10, color: '#5a5f6e', margin: '4px 0 0' }}>Annualised return</p>
                        </div>

                        {/* Asset allocation donut */}
                        <AssetAllocationDonut investments={investments} />

                        {/* 10-Year forecast */}
                        <div style={{
                            background: '#111214',
                            border: '1px solid #1e2025',
                            borderRadius: 8,
                            padding: '14px 16px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', right: -16, top: -16, width: 80, height: 80,
                                background: 'rgba(0,200,83,0.06)', borderRadius: '50%', filter: 'blur(20px)',
                                pointerEvents: 'none',
                            }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
                                    10-Year Forecast
                                </p>
                                <span style={{
                                    fontSize: 9, fontWeight: 700, color: '#00C853',
                                    background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.2)',
                                    padding: '2px 6px', borderRadius: 3,
                                }}>
                                    12% CAGR
                                </span>
                            </div>

                            {isProjectionLoading ? (
                                <div style={{ fontSize: 11, color: '#5a5f6e', textAlign: 'center', padding: '12px 0' }}>Calculating…</div>
                            ) : projectionData ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div>
                                        <p style={{ fontSize: 10, color: '#5a5f6e', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projected</p>
                                        <p style={{ fontSize: 16, fontWeight: 700, color: '#e8eaed', margin: 0 }}>
                                            ₹{projectionData.projectedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 10, color: '#5a5f6e', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Growth</p>
                                        <p style={{ fontSize: 16, fontWeight: 700, color: '#00C853', margin: 0 }}>
                                            +₹{projectionData.projectedProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                    <p style={{ gridColumn: '1/-1', fontSize: 9, color: '#5a5f6e', margin: '8px 0 0', borderTop: '1px solid #1e2025', paddingTop: 8, lineHeight: 1.5 }}>
                                        Based on current value and conservative 12% annual return over 10 years.
                                    </p>
                                </div>
                            ) : (
                                <div style={{ fontSize: 11, color: '#5a5f6e', textAlign: 'center', padding: '12px 0' }}>No data available</div>
                            )}
                        </div>

                        {/* Redeem profit */}
                        <button
                            onClick={() => navigate({ to: ROUTES.USER.PORTFOLIO.REDEEM_PROFIT })}
                            style={{
                                width: '100%',
                                padding: '10px 0',
                                background: 'rgba(0,200,83,0.1)',
                                border: '1px solid rgba(0,200,83,0.25)',
                                borderRadius: 6,
                                color: '#00C853',
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                transition: 'all 0.15s',
                                letterSpacing: '0.03em',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,200,83,0.18)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,200,83,0.1)';
                            }}
                        >
                            <TrendingUp size={14} />
                            Redeem Profit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── small helper components ─────────────────────────────────── */

const DetailGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <p style={{ fontSize: 9, fontWeight: 700, color: '#5a5f6e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, margin: '0 0 8px' }}>
            {label}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {children}
        </div>
    </div>
);

const DetailRow = ({ k, v, vc }: { k: string; v: string; vc?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#5a5f6e' }}>{k}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: vc || '#e8eaed' }}>{v}</span>
    </div>
);

export default PortfolioDashboard;