'use client';
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchMutualFunds, fetchSips } from '@shared/services/feature/mutual-fund/MutualFundApisUserSide';
import { useNavigate } from '@tanstack/react-router';
import type { SipDto } from '../types/mutual-fund.types';
import api from '@lib/axiosUser';
import { ROUTES } from '@shared/constants/routes';

import FundsTab from '../components/mutual-fund/FundsTab';
import SipsTab from '../components/mutual-fund/SipsTab';
import HistoryTab from '../components/mutual-fund/HistoryTab';
import DashboardSidebar from '../components/mutual-fund/DashboardSidebar';
import { CancelSipStatus, PauseSipStatus, ResumeSipStatus } from '@shared/services/admin/sip-management/SipManagementUserApi';
import { toast } from 'sonner';

const MutualFundDashboard = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['All Funds']);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 400);
    const [activeTab, setActiveTab] = useState<'funds' | 'sips' | 'transactions'>('funds');

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const recentNAVUpdates = [
        { fund: 'HDFC Mid-Cap Opp.', nav: 185.42, change: 1.12, date: '22 Jan 2026' },
        { fund: 'Parag Parikh Flexi Cap', nav: 78.95, change: -0.45, date: '22 Jan 2026' },
        { fund: 'SBI Small Cap', nav: 162.31, change: 0.78, date: '22 Jan 2026' },
        { fund: 'Axis Bluechip', nav: 62.18, change: -0.22, date: '22 Jan 2026' },
        { fund: 'ICICI Pru Corp Bond', nav: 18.76, change: 0.15, date: '22 Jan 2026' },
    ];

    const fundQueryKey = useMemo(
        () => ['user-funds-list', debouncedSearch, selectedFilters],
        [debouncedSearch, selectedFilters]
    );

    const { data: fundsData, isLoading: fundsLoading } = useQuery({
        queryKey: fundQueryKey,
        queryFn: () => fetchMutualFunds(debouncedSearch, selectedFilters),
        enabled: activeTab === 'funds',
        placeholderData: prev => prev,
    });

    const funds = fundsData?.data ?? [];

    const { data: sipsData, isLoading: sipsLoading } = useQuery({
        queryKey: ['sip-lists'],
        queryFn: fetchSips,
        enabled: activeTab === 'sips',
    });

    const sips = (sipsData as any)?.data?.data as SipDto[] ?? [];

    const { data: investmentsData, isLoading: investmentsLoading } = useQuery({
        queryKey: ['investments-listing'],
        queryFn: async () => api.get('/user/mutual-funds/investments'),
        enabled: activeTab === 'transactions',
    });

    const investments = (investmentsData as any)?.data?.data ?? [];

    const pauseMutation = useMutation({
        mutationFn: PauseSipStatus,
        onSuccess: (res) => {
            toast.success(res.data?.message || 'SIP paused successfully');
            queryClient.invalidateQueries({ queryKey: ['sip-lists'] });
        },
    });

    const resumeMutation = useMutation({
        mutationFn: ResumeSipStatus,
        onSuccess: (res) => {
            toast.success(res.data?.message || 'SIP resumed successfully');
            queryClient.invalidateQueries({ queryKey: ['sip-lists'] });
        },
    });

    const cancelMutation = useMutation({
        mutationFn: CancelSipStatus,
        onSuccess: (res) => {
            toast.success(res.data?.message || 'SIP cancelled successfully');
            queryClient.invalidateQueries({ queryKey: ['sip-lists'] });
        },
    });

    const handlePause = (sipId: string) => pauseMutation.mutate(sipId);
    const handleResume = (sipId: string) => resumeMutation.mutate(sipId);
    const handleCancel = (sipId: string) => cancelMutation.mutate(sipId);

    const handleEdit = (sipId: string) => {
        alert(`Edit flow for SIP ${sipId} would open here (demo)`);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold">Mutual Funds</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Your investment portfolio</p>
                    </div>
                    <button
                        onClick={() => navigate({ to: ROUTES.USER.MUTUAL_FUNDS.ROOT })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        New SIP
                    </button>
                </div>

                <div className="flex border-b border-[#1f1f1f] gap-8">
                    {['funds', 'sips', 'transactions'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-2 text-sm font-medium transition-colors ${activeTab === tab
                                ? 'text-white border-b-2 border-green-500'
                                : 'text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            {tab === 'funds' ? 'Funds' : tab === 'sips' ? 'SIPs' : 'History'}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-8 space-y-5">
                        {activeTab === 'funds' && (
                            <FundsTab
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedFilters={selectedFilters}
                                setSelectedFilters={setSelectedFilters}
                                fundsLoading={fundsLoading}
                                funds={funds}
                                onFundClick={(schemeCode) =>
                                    navigate({
                                        to: `/user/mutual-funds/$schemeCode`,
                                        params: { schemeCode },
                                    })
                                }
                            />
                        )}

                        {activeTab === 'sips' && (
                            <SipsTab
                                sipsLoading={sipsLoading}
                                sips={sips}
                                handlePause={handlePause}
                                handleResume={handleResume}
                                handleEdit={handleEdit}
                                handleCancel={handleCancel}
                            />
                        )}

                        {activeTab === 'transactions' && (
                            <HistoryTab
                                investmentsLoading={investmentsLoading}
                                investments={investments}
                            />
                        )}
                    </div>

                    <DashboardSidebar
                        recentNAVUpdates={recentNAVUpdates}
                        onNewSipClick={() => navigate({ to: ROUTES.USER.MUTUAL_FUNDS.ROOT })}
                        onOneTimeClick={() => navigate({ to: ROUTES.USER.MUTUAL_FUNDS.ROOT })}
                    />
                </div>
            </div>
        </div>
    );
};

export default MutualFundDashboard;
