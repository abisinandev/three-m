import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getJobLogs } from '@/shared/services/admin/system-management/system-api';
import { 
    Activity, 
    Search, 
    Filter, 
    AlertCircle, 
    CheckCircle2, 
    Clock,
    Eye,
    RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { Pagination } from '@/shared/components/pagination/Pagination';

export function JobLogsPage() {
    const [page, setPage] = useState(1);
    const [jobName, setJobName] = useState('');
    const [status, setStatus] = useState('');
    const limit = 15;

    const { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['admin-job-logs', page, jobName, status],
        queryFn: () => getJobLogs({ page, limit, jobName, status }),
        placeholderData: (previousData) => previousData,
    });

    const logs = data?.logs || [];
    const total = data?.total || 0;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return <CheckCircle2 className="text-emerald-500" size={14} />;
            case 'FAILED':
                return <AlertCircle className="text-red-500" size={14} />;
            case 'RUNNING':
                return <Clock className="text-blue-500 animate-pulse" size={14} />;
            default:
                return null;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'FAILED':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'RUNNING':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default:
                return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
        }
    };

    const formatDuration = (ms?: number) => {
        if (ms === undefined) return '—';
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="text-emerald-500" size={18} />
                        System Job Logs
                    </h1>
                    <p className="text-neutral-500 text-[11px]">
                        Monitor background workers and scheduler execution history
                    </p>
                </div>
                <button 
                    onClick={() => refetch()}
                    disabled={isLoading || isRefetching}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-[12px] text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={14} className={isRefetching ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-neutral-900/40 p-3 rounded-lg border border-neutral-800">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                    <input
                        type="text"
                        placeholder="Search job..."
                        value={jobName}
                        onChange={(e) => {
                            setJobName(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-md text-[13px] text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-md text-[13px] text-white appearance-none focus:outline-none focus:border-emerald-500/50 transition-colors"
                    >
                        <option value="">All Status</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILED">Failed</option>
                        <option value="RUNNING">Running</option>
                    </select>
                </div>
                <div className="flex items-center justify-end text-neutral-500 text-[11px]">
                    {total} logs
                </div>
            </div>

            {/* Table */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-900/50 border-b border-neutral-800">
                                <th className="px-4 py-2.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-tight">Job Name</th>
                                <th className="px-4 py-2.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-tight">Status</th>
                                <th className="px-4 py-2.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-tight">Started At</th>
                                <th className="px-4 py-2.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-tight">Duration</th>
                                <th className="px-4 py-2.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-tight">Count</th>
                                <th className="px-4 py-2.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-tight text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-900">
                            {isLoading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-4 py-2 h-10 bg-neutral-950" />
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-600 text-[13px]">
                                        No logs found
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-neutral-900/20 transition-colors">
                                        <td className="px-4 py-2">
                                            <span className="text-[13px] font-medium text-neutral-200">{log.jobName}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusStyle(log.status)}`}>
                                                {getStatusIcon(log.status)}
                                                {log.status}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="text-[12px] text-neutral-400">
                                                {format(new Date(log.startTime), 'MMM dd, HH:mm:ss')}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="text-[12px] text-neutral-500">{formatDuration(log.duration)}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] text-emerald-500/80">✓ {log.processedCount}</span>
                                                {log.failedCount > 0 && (
                                                    <span className="text-[11px] text-red-500/80">✗ {log.failedCount}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <button className="p-1.5 text-neutral-600 hover:text-white hover:bg-neutral-800 rounded transition-colors">
                                                <Eye size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination 
                    page={page} 
                    limit={limit} 
                    total={total} 
                    onPageChange={setPage} 
                />
            </div>
        </div>
    );
}
