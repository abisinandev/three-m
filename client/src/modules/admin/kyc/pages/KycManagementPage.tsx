'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { BadgeCheck, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

import type { KycUser } from '@shared/types/user/KycUserType';
import { fetchKycUsers } from '@shared/services/admin/user-management/kyc-apis';
import { ROUTES } from '@shared/constants/apiRoutes';

import { Pagination } from '@shared/components/pagination/Pagination';
import { KycUsersTable } from '../components/KycTable';

const KycVerificationPage = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    page: 1,
    status: '',
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-kyc-users', filters],
    queryFn: () => fetchKycUsers(filters),
    placeholderData: keepPreviousData,
  });

  const users: KycUser[] = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
              <BadgeCheck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">KYC Verification</h1>
              <p className="text-xs text-neutral-400">
                Review and verify user identity documents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-semibold text-teal-400">{total}</p>
              <p className="text-[10px] text-neutral-500">Total Requests</p>
            </div>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ page: 1, status: e.target.value })
              }
              className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
              <p className="text-xs text-neutral-400">Loading KYC requests...</p>
            </div>
          )}

          {isError && (
            <div className="py-20 text-center text-xs text-red-400">
              Failed to load KYC requests. Please try again.
            </div>
          )}

          {!isLoading && !isError && users.length === 0 && (
            <div className="py-20 text-center text-xs text-neutral-500">
              No KYC requests found
            </div>
          )}

          {!isLoading && !isError && users.length > 0 && (
            <>
              <KycUsersTable
                users={users}
                onView={(user) => {
                  navigate({
                    to: ROUTES.ADMIN.KYC_MANAGEMENT.VIEW(user.id) as "/admin/view-kyc/$kycId",
                    params: (prev: Record<string, string>) => ({ ...prev, kycId: user.id }),
                  });
                }}
              />

              <div className="border-t border-neutral-800 bg-[#0f0f0f]">
                <Pagination
                  page={filters.page}
                  limit={10}
                  total={total}
                  onPageChange={(page) =>
                    setFilters((prev) => ({ ...prev, page }))
                  }
                />
              </div>
            </>
          )}
        </div>

        <div className="text-center text-[10px] text-neutral-600">
          Only authorized admins can approve or reject KYC submissions.
        </div>
      </div>
    </div>
  );
};

export default KycVerificationPage;

