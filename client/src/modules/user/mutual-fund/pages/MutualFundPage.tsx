'use client';
import { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchMutualFunds, fetchSips } from '@/shared/services/mutual-fund/mutual-fund-apis-user-side';
import { useNavigate } from '@tanstack/react-router';
import { useUserStore } from '@stores/user/UserStore';
import api from '@/lib/axios-user';

import { toast } from 'sonner';
import { CancelSipStatus, PauseSipStatus, ResumeSipStatus } from '@/shared/services/admin/sip-management/sip-management-user-api';
import FundsTab from '../components/dashboard/FundsTab';
import SipsTab from '../components/dashboard/SipsTab';
import HistoryTab from '../components/dashboard/HistoryTab';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import type { FundDetails } from '../types/details.types';
import type { IInvestmentResponse } from '@/shared/types/portfolio.types';

const MutualFundDashboard = () => {
    const user = useUserStore((state) => state.user);
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['All Funds']);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 400);
    const [activeTab, setActiveTab] = useState<'funds' | 'sips' | 'transactions'>('funds');

    const navigate = useNavigate();
    const queryClient = useQueryClient();

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

    const funds = useMemo(() => {
        const rawFunds = fundsData?.data ?? [];
        return rawFunds.map((f) => ({
            ...f,
            nav: f?.nav,
            navDate: f?.navDate,
        }));
    }, [fundsData]);

    const recentNAVUpdates = useMemo(() => {
        const currentFunds = fundsData?.data ?? [];
        if (!currentFunds || currentFunds.length === 0) return [];
        return currentFunds.slice(0, 5).map((fund) => {
            const hash = fund.schemeName?.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) || 0;
            const change = ((hash % 400) / 100) - 2;

            return {
                fund: fund.schemeName || 'Unknown Fund',
                nav: fund?.nav || 0,
                change: change,
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            };
        });
    }, [fundsData]);


    const { data: sipsResponse, isLoading: sipsLoading } = useQuery({
        queryKey: ['sip-lists'],
        queryFn: fetchSips,
        enabled: activeTab === 'sips',
    });

    const sips = sipsResponse?.data?.data ?? [];

    const { data: investmentsResponse, isLoading: investmentsLoading } = useQuery({
        queryKey: ['investments-listing'],
        queryFn: async () => {
            const res = await api.get('/user/mutual-funds/investments');
            return res.data;
        },
        enabled: activeTab === 'transactions',
    });

    const investments = (investmentsResponse?.data as unknown[]) ?? [];

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
        <div
            className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] pb-10 selection:bg-[#2962ff]/30"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pt-6 px-6 max-w-[1600px] mx-auto">
                <div>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', letterSpacing: '-0.2px', margin: 0 }}>
                        Mutual Funds Dashboard
                    </h2>
                    <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0 }}>
                        Manage your investments, SIPs, and mutual fund history.
                    </p>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 px-6 max-w-[1600px] mx-auto">

                <div className="flex-1 space-y-6">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1e2025] pb-4">
                        <div className="flex bg-[#111214] p-1 rounded-lg border border-[#1e2025]">
                            {['funds', 'sips', 'transactions'].map(tab => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as 'funds' | 'sips' | 'transactions')}
                                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${isActive
                                            ? 'bg-[#1a1c20] text-[#e8eaed] shadow-sm'
                                            : 'text-[#6a7182] hover:text-[#e8eaed] hover:bg-[#1a1c20]/50'
                                            }`}
                                    >
                                        {tab === 'funds' ? 'All Funds' : tab === 'sips' ? 'Active SIPs' : 'History'}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-5">
                        {activeTab === 'funds' && (
                            <FundsTab
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedFilters={selectedFilters}
                                setSelectedFilters={setSelectedFilters}
                                fundsLoading={fundsLoading}
                                funds={funds as unknown as FundDetails[]}
                                onFundClick={(schemeCode) =>
                                    navigate({
                                        to: `/user/mutual-funds/$schemeCode` as '/user/mutual-funds/$schemeCode',
                                        params: (prev: Record<string, string>) => ({ ...prev, schemeCode }),
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
                                isVerified={user?.isVerified ?? false}
                            />
                        )}

                        {activeTab === 'transactions' && (
                            <HistoryTab
                                investmentsLoading={investmentsLoading}
                                investments={investments as unknown as IInvestmentResponse[]}
                            />
                        )}
                    </div>
                </div>

                <div className="w-full xl:w-80 space-y-6">
                    <DashboardSidebar recentNAVUpdates={recentNAVUpdates} />
                </div>
            </div>
        </div>
    );
};

export default MutualFundDashboard;


