import { useState } from 'react';
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    DollarSign,
    Calendar,
    Activity,
    Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ROUTES } from '@shared/constants/routes';
import { StatsCardComponent } from '@shared/components/cards/StatCardComponent';
import { SipStatusBadge } from '../components/SipStatusBadges';
import { fetchSipDetailsApi } from '@shared/services/admin/sip-management/sip-management-admin-api';
import { useNavigate, useParams } from '@tanstack/react-router';

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
        placeholderData: (prev) => prev,
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
                    onClick={() => navigate({ to: ROUTES.ADMIN.SIP_MANAGEMENT.ROOT })}
                    className="text-[10px] text-neutral-400 hover:text-neutral-200 mt-1"
                >
                    ← Back
                </button>
            </div>
        );
    }

    const sip = data.data;
    const installments = sip.installments ?? [];

    const totalInvested = sip.executedInstallments * sip.amount;
    const progressPercentage = (
        (sip.executedInstallments / Math.max(sip.totalInstallments, 1)) *
        100
    ).toFixed(0);



    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-5 space-y-6 text-xs">
            {/* Header */}
            <div className="space-y-2">
                <button
                    onClick={() => navigate({ to: ROUTES.ADMIN.SIP_MANAGEMENT.ROOT })}
                    className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-200 text-[10px] font-semibold uppercase tracking-wide"
                >
                    <ArrowLeft size={13} />
                    Back to SIPs
                </button>

                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">SIP Details</h1>
                    <SipStatusBadge status={sip.status} />
                </div>

                <p className="text-[11px] text-neutral-500 font-mono">
                    Scheme-code:{' '}
                    <span className="text-emerald-400">
                        {sip.schemeCode}
                    </span>
                </p>
            </div>

            {/* Stats */}
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
                    value={new Date(
                        sip.nextExecutionDate
                    ).toLocaleDateString('en-IN', {
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

            {/* Info + Actions */}
            <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-500 rounded-full" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 flex-1 w-full">
                        <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Start Date</span>
                            <p className="text-sm font-medium text-neutral-200">
                                {new Date(sip.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Scheme</span>
                            <p className="text-sm font-mono text-emerald-400 font-medium">{sip.schemeCode}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">User Code</span>
                            <p className="text-sm font-mono text-blue-400 font-medium">{sip.userCode}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Installments</span>
                            <p className="text-sm font-medium text-neutral-200">
                                {sip.executedInstallments} <span className="text-neutral-500 mx-1">/</span> {sip.totalInstallments}
                            </p>
                        </div>
                    </div>


                </div>
            </div>

            {/* Execution History */}
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
                        className="text-[11px] bg-[#111] border border-neutral-800 rounded px-2 py-1"
                    >
                        <option value="">All</option>
                        <option value="ALLOCATED">Allocated</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                    </select>
                </div>

                <div className="bg-[#0d0d0d] border border-neutral-800 rounded-lg overflow-hidden">
                    {installments.length === 0 ? (
                        <div className="p-8 text-center text-neutral-600">
                            No installments yet
                        </div>
                    ) : (
                        installments.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-3 px-4 py-2.5 border-b border-neutral-800"
                            >
                                <div>
                                    <div className="text-neutral-500">
                                        #{item.installmentNo}
                                    </div>
                                    <div className="text-neutral-300">
                                        {new Date(
                                            item.executionDate
                                        ).toLocaleDateString('en-IN')}
                                    </div>
                                </div>

                                <div className="text-center text-emerald-400 font-mono">
                                    ₹{item.amount.toLocaleString()}
                                </div>

                                <div className="text-right uppercase font-semibold">
                                    {item.status}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>


        </div>
    );
};

export default SipDetailsPage;

