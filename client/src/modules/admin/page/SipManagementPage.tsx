import { useState, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, PauseCircle, PlayCircle, XCircle, List, DollarSign, Activity, XOctagon } from 'lucide-react';
import type { SIP, SipStatus } from '../types/SipTypes';
import { SipStatusBadge } from '../components/SipStatusBadges';
import { useNavigate } from '@tanstack/react-router';
import { StatsCardComponent } from '@shared/components/cards/StatCardComponent';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchSipsApi, type SipFilters } from '@shared/services/admin/sip-management/SipManagementApi';

const SipManagementPage = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<SipFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-sip-management', filters],
    queryFn: () => fetchSipsApi(filters),
    placeholderData: keepPreviousData,
  });


  const updateFilters = (updates: Partial<SipFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      page: updates.page ?? 1,
    }));
  };

  const debouncedSearch = useDebouncedCallback(
    (search: string) => updateFilters({ search }),
    400
  );

  const [modal, setModal] = useState<{
    open: boolean;
    type: 'PAUSE' | 'RESUME' | 'CANCEL' | null;
    sipId: string | null;
  }>({ open: false, type: null, sipId: null });

  const updateStatusMutation = useMutation({
    // mutationFn: UpdateSipStatusApi,
    // onSuccess: () => {
    //   refetch();
    //   toast.success(`SIP status updated successfully`);
    //   setModal({ open: false, type: null, sipId: null });
    // },
    // onError: (error: any) => {
    //   toast.error(error?.response?.data?.message || 'Failed to update SIP status');
    // }
  });

  const openModal = (type: 'PAUSE' | 'RESUME' | 'CANCEL', sipId: string) => {
    setModal({ open: true, type, sipId });
  };

  const handleConfirmAction = () => {
    if (!modal.sipId || !modal.type) return;

    let targetStatus: SipStatus = 'ACTIVE';
    if (modal.type === 'PAUSE') targetStatus = 'PAUSED';
    if (modal.type === 'CANCEL') targetStatus = 'CANCELLED';
    if (modal.type === 'RESUME') targetStatus = 'ACTIVE';


  };

  const sips = useMemo(() => data?.data ?? [], [data]);
  const total = data?.totalCount || 0;
  const totalActiveSips = data?.totalActiveSips || 0;

  const stats = useMemo(() => {
    const paused = sips.filter((s: SIP) => s.status === 'PAUSED').length;
    const cancelled = sips.filter((s: SIP) => s.status === 'CANCELLED').length;

    return {
      total: total,
      active: totalActiveSips,
      paused: paused,
      cancelled: cancelled,
      totalAmount: sips.reduce((acc: number, s: SIP) => acc + s.amount, 0),
    };
  }, [sips, total, totalActiveSips]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">SIP Management</h1>
        <p className="text-xs text-neutral-400">
          Monitor and control recurring mutual fund investments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCardComponent
          title="Total SIPs"
          value={stats.total}
          icon={<DollarSign size={20} />}
          color="blue"
          subtitle={`Total Portfolio Volume`}
        />
        <StatsCardComponent
          title="Active SIPs"
          value={stats.active}
          icon={<Activity size={20} />}
          color="emerald"
          subtitle={`${((stats.active / (stats.total || 1)) * 100).toFixed(1)}% of total`}
        />
        <StatsCardComponent
          title="Paused SIPs"
          value={stats.paused}
          icon={<PauseCircle size={20} />}
          color="amber"
          subtitle={`${((stats.paused / (stats.total || 1)) * 100).toFixed(1)}% of total`}
        />
        <StatsCardComponent
          title="Cancelled SIPs"
          value={stats.cancelled}
          icon={<XOctagon size={20} />}
          color="rose"
          subtitle={`${((stats.cancelled / (stats.total || 1)) * 100).toFixed(1)}% of total`}
        />
      </div>

      <div className="bg-[#111] p-4 rounded-xl border border-neutral-800 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1.5 ml-0.5 tracking-wider">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input
              type="text"
              placeholder="Search by User, SIP ID, Scheme..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-neutral-600"
              defaultValue={filters.search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="w-[180px]">
          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1.5 ml-0.5 tracking-wider">Status</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
            <select
              className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white appearance-none focus:outline-none focus:border-emerald-500/50 transition-all"
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value as SipStatus | 'ALL' })}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => { updateFilters({ search: '', status: 'ALL' }); }}
          className="px-4 py-2 text-xs text-neutral-400 font-medium hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="bg-[#111] rounded-xl border border-neutral-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50">
                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">User ID</th>
                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Scheme Code</th>
                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-right">Amount</th>
                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">Freq</th>
                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Next Execution</th>
                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">Progress</th>
                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Status</th>
                <th className="px-5 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-xs text-neutral-500">
                    Loading SIP data...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-xs text-rose-500">
                    Failed to load SIP data. Please try again.
                  </td>
                </tr>
              ) : sips.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-xs text-neutral-500">
                    No SIP records found
                  </td>
                </tr>
              ) : (
                sips.map((sip: SIP) => (
                  <tr
                    key={sip.id}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    onClick={() => {
                      navigate({ to: `/admin/sip-details/$sipId`, params: { sipId: sip.id } });
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="text-[13px] font-medium text-neutral-200 truncate max-w-[120px]" title={sip.userId}>{sip.userId}</div>
                      <div className="text-[10px] text-neutral-500 font-mono uppercase mt-0.5">{sip.id.slice(-8)}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[12px] font-bold text-neutral-300 font-mono">{sip.schemeCode}</div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="text-[13px] font-bold text-emerald-500">₹{sip.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-[10px] font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded uppercase tracking-wider">{sip.frequency}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[12px] text-neutral-400 font-medium">
                        {new Date(sip.nextExecutionDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-[12px] font-bold text-neutral-300">
                          {sip.executedInstallments}/{sip.totalInstallments}
                        </div>
                        <div className="w-12 h-1 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${(sip.executedInstallments / (sip.totalInstallments || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <SipStatusBadge status={sip.status} />
                    </td>
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {sip.status === 'ACTIVE' && (
                          <button
                            className="p-1.5 hover:bg-amber-500/10 rounded text-amber-500 transition-all"
                            title="Pause SIP"
                            onClick={() => openModal('PAUSE', sip.id)}
                          >
                            <PauseCircle size={16} />
                          </button>
                        )}
                        {sip.status === 'PAUSED' && (
                          <button
                            className="p-1.5 hover:bg-emerald-500/10 rounded text-emerald-500 transition-all"
                            title="Resume SIP"
                            onClick={() => openModal('RESUME', sip.id)}
                          >
                            <PlayCircle size={16} />
                          </button>
                        )}
                        {sip.status !== 'CANCELLED' && (
                          <button
                            className="p-1.5 hover:bg-rose-500/10 rounded text-rose-500 transition-all"
                            title="Cancel SIP"
                            onClick={() => openModal('CANCEL', sip.id)}
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <button
                          className="p-1.5 hover:bg-blue-500/10 rounded text-blue-400 transition-all"
                          title="View Details"
                          onClick={() => {
                            navigate({ to: `/admin/sip-details/$sipId`, params: { sipId: sip.id } });
                          }}
                        >
                          <List size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-neutral-800 rounded text-neutral-500 transition-all" title="More">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-neutral-900/30 px-5 py-4 border-t border-neutral-800 flex items-center justify-between">
          <div className="text-[11px] text-neutral-500 font-medium">
            Showing <span className="text-neutral-300">
              {Math.min((filters.page! - 1) * filters.limit! + 1, total)}-{Math.min(filters.page! * filters.limit!, total)}
            </span> of <span className="text-neutral-300">{total}</span> entries
          </div>
          <div className="flex gap-2">
            <button
              disabled={filters.page === 1 || isLoading}
              onClick={() => updateFilters({ page: filters.page! - 1 })}
              className={`px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-[11px] font-bold transition-all ${filters.page === 1 || isLoading ? 'text-neutral-600 cursor-not-allowed' : 'text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800'}`}
            >
              PREV
            </button>
            <button
              disabled={filters.page! * filters.limit! >= total || isLoading}
              onClick={() => updateFilters({ page: filters.page! + 1 })}
              className={`px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-[11px] font-bold transition-all ${filters.page! * filters.limit! >= total || isLoading ? 'text-neutral-600 cursor-not-allowed' : 'text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800'}`}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>

      {
        modal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] rounded-xl shadow-2xl border border-neutral-800 w-full max-w-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${modal.type === 'CANCEL' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                    {modal.type === 'CANCEL' ? <XCircle size={24} /> : <PauseCircle size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {modal.type === 'CANCEL' ? 'Cancel SIP' : modal.type === 'PAUSE' ? 'Pause SIP' : 'Resume SIP'}
                    </h3>
                    <p className="text-[11px] text-neutral-500 leading-none mt-1">ID: {modal.sipId}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                  Are you sure you want to {modal.type?.toLowerCase()} this SIP? This action {modal.type === 'CANCEL' ? 'is irrevocable and will stop all future investment cycles.' : 'will temporarily halt future execution dates.'}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setModal({ open: false, type: null, sipId: null })}
                    className="px-5 py-2.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={updateStatusMutation.isPending}
                    onClick={handleConfirmAction}
                    className={`px-6 py-2.5 text-xs font-bold text-white rounded-lg shadow-lg transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed ${modal.type === 'CANCEL' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    {updateStatusMutation.isPending ? 'Processing...' : modal.type === 'CANCEL' ? 'Terminate SIP' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default SipManagementPage;