import { useMemo } from 'react';
import { ArrowLeft, Clock, CheckCircle2, DollarSign, Calendar, Hash, Activity } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { FetchSipDetailsApi } from '@shared/services/admin/sip-management/SipManagementApi';
import { StatsCardComponent } from '@shared/components/cards/StatCardComponent';
import { SipStatusBadge, InstallmentStatusBadge } from '../components/SipStatusBadges';
import type { SIP, SipInstallment } from '../types/SipTypes';

const SipDetailsPage = () => {
    const navigate = useNavigate();
    const { sipId } = useParams({ from: '/admin/sip-details/$sipId' });

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['admin-sip-details', sipId],
        queryFn: () => FetchSipDetailsApi(sipId as string),
    });

    console.log('sip-details: ', response)

    const sip: SIP | null = useMemo(() => response?.sip ?? null, [response]);
    const installments: SipInstallment[] = useMemo(() => response?.installments ?? [], [response]);

    const stats = useMemo(() => {
        if (!installments.length) return null;
        return {
            total: installments.length,
            allocated: installments.filter(i => i.status === 'ALLOCATED').length,
            failed: installments.filter(i => i.status === 'FAILED').length,
            totalInvested: installments.filter(i => i.status === 'ALLOCATED').reduce((acc, i) => acc + i.amount, 0),
        };
    }, [installments]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-zinc-500 text-sm animate-pulse">Loading SIP details...</div>
            </div>
        );
    }

    if (isError || !sip) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-rose-500 text-sm font-medium">Failed to load SIP details</div>
                <button
                    onClick={() => navigate({ to: '/admin/sip-management' })}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white hover:bg-zinc-800"
                >
                    Back to Management
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate({ to: '/admin/sip-management' })}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-2 text-[11px] font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} />
                        Back to SIPs
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-semibold text-white">SIP Details</h1>
                        <SipStatusBadge status={sip.status} />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                        Viewing execution history for SIP <span className="text-blue-400 font-mono">#{sip.id.slice(-8)}</span>
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCardComponent
                    title="Installment Amount"
                    value={sip.amount}
                    prefix="₹"
                    icon={<DollarSign size={20} />}
                    color="emerald"
                    subtitle={`${sip.frequency} frequency`}
                />
                <StatsCardComponent
                    title="Progress"
                    value={`${sip.executedInstallments}/${sip.totalInstallments}`}
                    icon={<Activity size={20} />}
                    color="blue"
                    subtitle={`${((sip.executedInstallments / (sip.totalInstallments || 1)) * 100).toFixed(0)}% completed`}
                />
                <StatsCardComponent
                    title="Next Execution"
                    value={new Date(sip.nextExecutionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    icon={<Calendar size={20} />}
                    color="amber"
                    subtitle="Expected date"
                />
                <StatsCardComponent
                    title="Total Invested"
                    value={stats?.totalInvested ?? 0}
                    prefix="₹"
                    icon={<CheckCircle2 size={20} />}
                    color="indigo"
                    subtitle="Successfully allocated"
                />
            </div>

            {/* Installments Table */}
            <div className="bg-[#090909] rounded-xl border border-zinc-900/50 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-900/50 flex items-center justify-between bg-zinc-900/20">
                    <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} />
                        Execution History
                    </h2>
                    <span className="text-[10px] text-zinc-600 font-medium">
                        {installments.length} installments generated
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-900/30">
                                <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">No.</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">NAV / Units</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900/30">
                            {installments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-zinc-600 text-xs">
                                        No installments recorded yet
                                    </td>
                                </tr>
                            ) : (
                                installments.map((inst) => (
                                    <tr key={inst.id} className="hover:bg-zinc-900/30 transition-colors group">
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-bold text-zinc-400">#{inst.installmentNo}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-xs text-zinc-200 font-medium whitespace-nowrap">
                                                {new Date(inst.executionDate).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                            <div className="text-[10px] text-zinc-600 mt-0.5 whitespace-nowrap">
                                                Generated {new Date(inst.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-xs font-bold text-white">₹{inst.amount.toLocaleString('en-IN')}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <InstallmentStatusBadge status={inst.status} />
                                        </td>
                                        <td className="px-5 py-4 text-xs">
                                            {inst.nav ? (
                                                <div className="flex flex-col">
                                                    <span className="text-zinc-300 font-medium">Nav: {inst.nav}</span>
                                                    <span className="text-zinc-500 text-[10px]">Units: {inst.units}</span>
                                                </div>
                                            ) : (
                                                <span className="text-zinc-800">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {inst.investmentId ? (
                                                <div className="text-[10px] font-mono text-blue-500/80 uppercase">
                                                    {inst.investmentId.slice(-10)}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-zinc-700 font-medium uppercase tracking-tight">Pending Allocation</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#090909] border border-zinc-900/50 rounded-xl p-5">
                    <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Hash size={14} />
                        Scheme Information
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-1 border-b border-zinc-900/30 last:border-0">
                            <span className="text-xs text-zinc-500">Scheme Code</span>
                            <span className="text-xs font-mono text-zinc-200">{sip.schemeCode}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-zinc-900/30 last:border-0">
                            <span className="text-xs text-zinc-500">User ID</span>
                            <span className="text-xs font-mono text-zinc-200 text-right max-w-[150px] truncate">{sip.userId}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-zinc-900/30 last:border-0">
                            <span className="text-xs text-zinc-500">Start Date</span>
                            <span className="text-xs text-zinc-200">{new Date(sip.startDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/10 border border-zinc-900/30 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center opacity-70">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                        <DollarSign size={20} className="text-zinc-600" />
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">Automatic execution handles payments and unit allocation on the scheduled dates.</p>
                </div>
            </div>
        </div>
    );
};

export default SipDetailsPage;
