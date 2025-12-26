import { useState } from "react";
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { BadgeCheck, Eye, Loader2 } from "lucide-react";
import { TableComponent } from "@shared/components/table/TableComponent";
import { Pagination } from "@shared/components/pagination/Pagination";
import { useNavigate } from "@tanstack/react-router";
import type { KycUser } from "@shared/types/user/KycUserType";
import { fetchKycUsers } from "@shared/services/admin/user-management/KycApis";

const StatusBadge = ({ status }: { status: KycUser["status"] }) => {
  switch (status) {
    case "verified":
      return (
        <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-green-600 rounded">
          Approved
        </span>
      );

    case "pending":
      return (
        <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-orange-500 rounded">
          Pending
        </span>
      );

    case "rejected":
      return (
        <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-red-600 rounded">
          Rejected
        </span>
      );

    default:
      return (
        <span className="inline-block px-2.5 py-1 text-[11px] font-medium text-gray-400">
          —
        </span>
      );
  }
};

// Table Columns - Cleaned & Enhanced
const columns = [
  { header: "User ID", accessor: "userCode" as const },
  { header: "Name", accessor: "fullName" as const },
  { header: "Email", accessor: "email" as const },
  { header: "PAN", accessor: "panNumber" as const },

  {
    header: "Status",
    accessor: "status" as const,
    render: (user: KycUser) => <StatusBadge status={user.status} />,
  },

  {
    header: "Submitted On",
    accessor: "createdAt" as const,
    render: (user: KycUser) =>
      user.createdAt
        ? new Intl.DateTimeFormat("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(user.createdAt))
        : "—",
  },
];

const KycVerificationPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    status: "",
  });

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-kyc-users", filters],
    queryFn: () => fetchKycUsers(filters),
    placeholderData: keepPreviousData,
  });

  const users: KycUser[] = data?.data || [];
  const total = data?.total || 0;

  const actions = [
    {
      label: "View",
      icon: <Eye className="w-3.5 h-3.5" />,
      className: "text-sky-400 hover:text-sky-300 hover:bg-sky-400/10 text-xs font-medium px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5",
      onClick: (user: KycUser) => {
        navigate({
          to: "/admin/view-kyc/$kycId",
          params: { kycId: user.id },
        });
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <BadgeCheck className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
              <p className="text-gray-400 mt-1">Review and verify user-submitted identity documents</p>
            </div>
          </div>

          {/* Filter + Stats */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-teal-400">{total}</p>
              <p className="text-xs text-gray-500">Total Requests</p>
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ page: 1, status: e.target.value })}
              className="px-4 py-2.5 bg-[#111] border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
            >
              <option value="">All Status</option>
              <option value="pending">Pending Only</option>
              <option value="verified">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
              <p className="text-gray-400">Loading KYC requests...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="py-24 text-center">
              <p className="text-red-400 text-lg">Failed to load data. Please try again.</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && users.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
                <BadgeCheck className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-xl text-gray-400">No KYC requests found</p>
              <p className="text-sm text-gray-500 mt-2">
                {filters.status ? `No ${filters.status} requests at the moment.` : "Try adjusting your filters."}
              </p>
            </div>
          )}

          {/* Table Content */}
          {!isLoading && !isError && users.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <TableComponent
                  columns={columns}
                  data={users}
                  actions={actions}
                />
              </div>

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

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-600">
          Only authorized admins can approve or reject KYC submissions.
        </div>
      </div>
    </div>
  );
};

export default KycVerificationPage;