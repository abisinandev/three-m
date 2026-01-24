import { useState } from 'react';
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    DollarSign,
    Calendar,
    Activity,
    Loader2,
    PauseCircle,
    Ban,
} from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { StatsCardComponent } from '@shared/components/cards/StatCardComponent';
import { SipStatusBadge } from '../components/SipStatusBadges';
import { fetchSipDetailsApi } from '@shared/services/admin/sip-management/SipManagementApi';

const SipDetailsPage = () => {
    const navigate = useNavigate();
    const { sipId } = useParams({ from: '/admin/sip-details/$sipId' });

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: '',
    });

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['sip-details', sipId, filters],
        queryFn: () =>
            fetchSipDetailsApi(sipId, {
                page: filters.page,
                limit: filters.limit,
                status: filters.status || undefined,
            }),
        enabled: !!sipId,
        placeholderData: (p) => p,
    });


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2">
                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                <p className="text-[11px] text-neutral-500">Loading SIP...</p>
            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2">
                <p className="text-xs text-rose-500">Failed to load SIP details</p>
                <button
                    onClick={() => navigate({ to: '/admin/sip-management' })}
                    className="text-[10px] text-neutral-400 hover:text-neutral-200 mt-1"
                >
                    ← Back
                </button>
            </div>
        );
    }

    const sip = data.data;
    const installments = data.data.installments ?? [];

    const totalInvested = sip.executedInstallments * sip.amount;
    const progressPercentage = (
        (sip.executedInstallments / Math.max(sip.totalInstallments, 1)) *
        100
    ).toFixed(0);

    const canPause = ['ACTIVE', 'RUNNING'].includes(sip.status);
    const canCancel = ['ACTIVE', 'RUNNING', 'PAUSED'].includes(sip.status);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-5 space-y-6 text-xs">
            {/* Header */}
            <div className="space-y-2">
                <button
                    onClick={() => navigate({ to: '/admin/sip-management' })}
                    className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-200 text-[10px] font-semibold uppercase tracking-wide"
                >
                    <ArrowLeft size={13} />
                    BACK TO SIPs
                </button>

                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">SIP Details</h1>
                    <SipStatusBadge status={sip.status} />
                </div>

                <p className="text-[11px] text-neutral-500 font-mono">
                    ID: <span className="text-emerald-400">{sip.id}</span>
                </p>
            </div>

            {/* Compact Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatsCardComponent
                    title="Amount"
                    value={sip.amount}
                    prefix="₹"
                    icon={<DollarSign size={16} />}
                    color="emerald"
                    size="sm"
                    subtitle={sip.frequency}
                />
                <StatsCardComponent
                    title="Progress"
                    value={`${sip.executedInstallments}/${sip.totalInstallments}`}
                    icon={<Activity size={16} />}
                    color="blue"
                    size="sm"
                    subtitle={`${progressPercentage}%`}
                />
                <StatsCardComponent
                    title="Next"
                    value={new Date(sip.nextExecutionDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                    })}
                    icon={<Calendar size={16} />}
                    color="amber"
                    size="sm"
                    subtitle="date"
                />
                <StatsCardComponent
                    title="Invested"
                    value={totalInvested}
                    prefix="₹"
                    icon={<CheckCircle2 size={16} />}
                    color="indigo"
                    size="sm"
                    subtitle="total"
                />
            </div>

            <div className="bg-[#111] border border-neutral-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 flex-1">
                    <div>
                        <span className="text-neutral-500">Start</span>
                        <p>{new Date(sip.startDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                        <span className="text-neutral-500">Scheme</span>
                        <p className="font-mono">{sip.schemeCode}</p>
                    </div>
                    <div>
                        <span className="text-neutral-500">User</span>
                        <p className="font-mono">
                            {sip.userCode}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral-500">Installments</span>
                        <p>
                            {sip.executedInstallments} / {sip.totalInstallments}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 self-start sm:self-center">
                    {canPause && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/60 border border-amber-800/50 rounded text-amber-300 hover:bg-amber-900/60 text-[11px] font-medium">
                            <PauseCircle size={14} />
                            Pause SIP
                        </button>
                    )}
                    {canCancel && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 border border-rose-800/50 rounded text-rose-300 hover:bg-rose-900/60 text-[11px] font-medium">
                            <Ban size={14} />
                            Cancel SIP
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold flex items-center gap-1.5">
                        <Clock size={14} />
                        Execution History
                    </h2>

                    <select
                        value={filters.status}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                page: 1,
                                status: e.target.value,
                            }))
                        }
                        className="text-[11px] bg-[#111] border border-neutral-800 rounded px-2.5 py-1 text-neutral-300"
                    >
                        <option value="">All</option>
                        <option value="ALLOCATED">Allocated</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                    </select>
                </div>

                <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg overflow-hidden text-[11px]">
                    {installments.length === 0 ? (
                        <div className="p-8 text-center text-neutral-600">
                            No installments yet
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-neutral-800/70">
                                {installments.map((item) => (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-3 px-4 py-2.5 items-center"
                                    >
                                        <div>
                                            <div className="text-neutral-500">
                                                #{item.installmentNo}
                                            </div>
                                            <div className="text-neutral-300">
                                                {new Date(item.executionDate).toLocaleDateString('en-IN')}
                                            </div>
                                        </div>

                                        <div className="text-center font-mono text-emerald-400">
                                            ₹{item.amount.toLocaleString()}
                                        </div>

                                        <div className="text-right font-semibold uppercase tracking-wide">
                                            <span
                                                className={
                                                    item.status === 'FAILED'
                                                        ? 'text-rose-400'
                                                        : item.status === 'ALLOCATED'
                                                            ? 'text-emerald-400'
                                                            : 'text-neutral-400'
                                                }
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="px-4 py-2.5 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 bg-neutral-950/30">
                                <span>
                                    {(filters.page - 1) * filters.limit + 1}–
                                    {Math.min(filters.page * filters.limit, data.totalCount)}{' '}
                                    of {data.totalCount}
                                </span>

                                <div className="flex gap-1.5">
                                    <button
                                        disabled={filters.page === 1}
                                        onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                                        className="px-2.5 py-1 disabled:opacity-40 bg-neutral-900 border border-neutral-700 rounded hover:bg-neutral-800 disabled:cursor-not-allowed"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        disabled={filters.page * filters.limit >= data.totalCount}
                                        onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                                        className="px-2.5 py-1 disabled:opacity-40 bg-neutral-900 border border-neutral-700 rounded hover:bg-neutral-800 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SipDetailsPage;