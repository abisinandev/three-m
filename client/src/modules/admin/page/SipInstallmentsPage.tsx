import { useState, useMemo } from 'react';
import { ArrowLeft, RefreshCw, FileText, ExternalLink, AlertCircle, CheckCircle2, XCircle, Clock, DollarSign } from 'lucide-react';
import type { SipInstallment } from '../types/SipTypes';
import { InstallmentStatusBadge } from '../components/SipStatusBadges';
import { useNavigate } from '@tanstack/react-router';
import { StatsCardComponent } from '@shared/components/cards/StatCardComponent';

const MOCK_INSTALLMENTS: SipInstallment[] = [
    {
        id: 'INST1001',
        installmentNo: 12,
        executionDate: '2026-01-01',
        amount: 5000,
        status: 'ALLOCATED',
        nav: 124.56,
        units: 40.14,
        navDate: '2026-01-01',
        investmentId: 'INV9988',
        failureReason: null,
        createdAt: '2026-01-01 10:05',
    },
    {
        id: 'INST1000',
        installmentNo: 11,
        executionDate: '2025-12-01',
        amount: 5000,
        status: 'PAYMENT_SUCCESS',
        nav: null,
        units: null,
        navDate: null,
        investmentId: null,
        failureReason: null,
        createdAt: '2025-12-01 10:02',
    },
    {
        id: 'INST0999',
        installmentNo: 10,
        executionDate: '2025-11-01',
        amount: 5000,
        status: 'FAILED',
        nav: null,
        units: null,
        navDate: null,
        investmentId: null,
        failureReason: 'Insufficient funds in linked bank account',
        createdAt: '2025-11-01 10:15',
    },
    {
        id: 'INST0998',
        installmentNo: 9,
        executionDate: '2025-10-01',
        amount: 5000,
        status: 'PENDING',
        nav: null,
        units: null,
        navDate: null,
        investmentId: null,
        failureReason: null,
        createdAt: '2025-10-01 09:00',
    },
];

const SipInstallmentsPage = () => {
    const navigate = useNavigate();
    const [installments] = useState<SipInstallment[]>(MOCK_INSTALLMENTS);
    const [retryModal, setRetryModal] = useState<{ open: boolean; instId: string | null }>({ open: false, instId: null });

    const stats = useMemo(() => {
        return {
            total: installments.length,
            allocated: installments.filter(i => i.status === 'ALLOCATED').length,
            failed: installments.filter(i => i.status === 'FAILED').length,
            totalInvested: installments.filter(i => i.status === 'ALLOCATED').reduce((acc, i) => acc + i.amount, 0),
        };
    }, [installments]);

    const handleRetry = (instId: string) => {
        setRetryModal({ open: true, instId });
    };

    const confirmRetry = () => {
        console.log(`Retrying installment ${retryModal.instId}`);
        setRetryModal({ open: false, instId: null });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate({ to: '/admin/sip-management' })}
                        className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-2 text-[11px] font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} />
                        Back to SIP List
                    </button>
                    <h1 className="text-xl font-semibold text-white">Execution History</h1>
                    <p className="text-xs text-neutral-400">Detailed logs for SIP: <span className="text-blue-400 font-mono">SIP123456</span></p>
                </div>
                <button className="bg-neutral-800 border border-neutral-700 text-neutral-300 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-700 transition-all flex items-center gap-2">
                    <RefreshCw size={14} />
                    Refresh Logs
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCardComponent
                    title="Total Installments"
                    value={stats.total}
                    icon={<Clock size={20} />}
                    color="blue"
                />
                <StatsCardComponent
                    title="Successfully Allocated"
                    value={stats.allocated}
                    icon={<CheckCircle2 size={20} />}
                    color="emerald"
                />
                <StatsCardComponent
                    title="Failures"
                    value={stats.failed}
                    icon={<XCircle size={20} />}
                    color="rose"
                />
                <StatsCardComponent
                    title="Total Invested"
                    value={stats.totalInvested}
                    prefix="₹"
                    icon={<DollarSign size={20} />}
                    color="indigo"
                />
            </div>

            {/* Table Container */}
            <div className="bg-[#111] rounded-xl border border-neutral-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-neutral-900/50 border-b border-neutral-800">
                                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Inst ID / No</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">Execution Date</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Amount</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Status</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">NAV / Units</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Investment ID</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {installments.map((inst) => (
                                <tr key={inst.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="text-[11px] font-mono font-bold text-blue-400 mb-0.5">{inst.id}</div>
                                        <div className="text-[12px] font-bold text-neutral-200"># {inst.installmentNo}</div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <div className="text-[12px] text-neutral-400 font-medium">{inst.executionDate}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="text-[13px] font-bold text-white">₹{inst.amount.toLocaleString()}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <InstallmentStatusBadge status={inst.status} />
                                        {inst.failureReason && (
                                            <div className="mt-1 flex items-start gap-1 text-[10px] text-rose-500/80 font-medium max-w-[150px]">
                                                <AlertCircle size={10} className="shrink-0 mt-0.5" />
                                                {inst.failureReason}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        {inst.nav ? (
                                            <div className="space-y-0.5">
                                                <div className="text-[12px] font-bold text-neutral-300">NAV: {inst.nav}</div>
                                                <div className="text-[10px] text-neutral-500 font-mono">Units: {inst.units}</div>
                                                <div className="text-[10px] text-neutral-600">{inst.navDate}</div>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] text-neutral-700 tracking-widest">---</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-[11px] font-mono text-neutral-500 uppercase">{inst.investmentId || 'PENDING'}</td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {inst.status === 'FAILED' && (
                                                <button
                                                    onClick={() => handleRetry(inst.id)}
                                                    className="px-3 py-1 text-[10px] font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-lg hover:bg-blue-400 hover:text-white transition-all uppercase tracking-wider"
                                                >
                                                    RETRY
                                                </button>
                                            )}
                                            <button className="p-1.5 text-neutral-600 hover:text-neutral-300 transition-colors" title="Logs">
                                                <FileText size={16} />
                                            </button>
                                            {inst.investmentId && (
                                                <button className="p-1.5 text-neutral-600 hover:text-blue-400 transition-colors" title="Investment">
                                                    <ExternalLink size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Retry Confirmation Modal */}
            {retryModal.open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] rounded-xl shadow-2xl border border-neutral-800 w-full max-w-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                    <RefreshCw size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-white">Retry Installment</h3>
                            </div>
                            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl mb-8 flex items-start gap-3">
                                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                <p className="text-xs text-amber-500/80 leading-relaxed">
                                    <strong>Warning:</strong> Ensure the previous failure reason (e.g. balance) is resolved. Retrying will trigger a new transaction attempt.
                                </p>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setRetryModal({ open: false, instId: null })}
                                    className="px-5 py-2.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRetry}
                                    className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition-all uppercase tracking-widest"
                                >
                                    Confirm Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SipInstallmentsPage;
