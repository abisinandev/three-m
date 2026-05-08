import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { FetchUserKycApi, approveKycApi, rejectKycApi } from "@shared/services/admin/user-management/kyc-apis";
import { toast } from "sonner";
import { useState } from "react";
import KycActionModal from "@shared/components/modals/KycActionModal";
import { ROUTES } from "@shared/constants/routes";
import { AdminKycUserInfo } from "../components/AdminKycUserInfo";
import { AdminKycDocuments } from "../components/AdminKycDocuments";

const ViewKycDocPage = () => {
  const { kycId } = useParams({ from: "/admin/view-kyc/$kycId" });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["kyc", kycId],
    queryFn: () => FetchUserKycApi(kycId),
    enabled: !!kycId,
  });

  const approve = useMutation({
    mutationFn: () => approveKycApi(kycId),
    onSuccess: () => {
      toast.success("KYC Approved Successfully!");
      queryClient.invalidateQueries({ queryKey: ["kyc", kycId] });
      queryClient.invalidateQueries({ queryKey: ["admin-kyc-users"] });
    },
    onError: () => toast.error("Failed to approve"),
  });

  const reject = useMutation({
    mutationFn: (reason: string) => rejectKycApi(kycId, reason),
    onSuccess: () => {
      toast.success("KYC Rejected");
      queryClient.invalidateQueries({ queryKey: ["kyc", kycId] });
      queryClient.invalidateQueries({ queryKey: ["admin-kyc-users"] });
    },
    onError: () => toast.error("Failed to reject"),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] flex items-center justify-center">
        <div className="text-[#5a5f6e] text-[13px] font-medium tracking-wider uppercase">Loading KYC details...</div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] flex items-center justify-center">
        <div className="text-[#F44336] text-[13px] font-bold tracking-wider uppercase">Failed to load KYC details</div>
      </div>
    );
  }

  const kyc = data.data;
  const status = kyc.status.toUpperCase();

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#e8eaed] font-sans pb-10">

      <div className="sticky top-0 z-50 bg-[#111214] border-b border-[#1e2025] shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={ROUTES.ADMIN.KYC_MANAGEMENT.ROOT}
              className="p-2.5 bg-[#0b0c0e] border border-[#1e2025] hover:bg-[#1e2025] rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-[#5a5f6e]" />
            </Link>
            <div>
              <h1 className="text-[18px] font-bold tracking-tight text-[#e8eaed]">KYC Review</h1>
              <p className="text-[12px] text-[#5a5f6e] font-medium mt-0.5 tracking-wide">
                {kyc.fullName} • {kyc.userCode || kyc.userId}
              </p>
            </div>
          </div>


          <div className="flex items-center gap-3">
            {status === "PENDING" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-[#00C853] hover:bg-[#00E676] text-black text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(0,200,83,0.3)]"
                >
                  <CheckCircle className="w-4 h-4" />
                  Review & Approve/Reject
                </button>
              </div>
            )}

            {status === "VERIFIED" && (
              <span className="px-6 py-3 bg-[#00C853]/10 border border-[#00C853]/20 text-[#00C853] text-[12px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-[0_0_10px_rgba(0,200,83,0.1)]">
                <CheckCircle className="w-4 h-4" />
                Approved
              </span>
            )}

            {status === "REJECTED" && (
              <span className="px-6 py-3 bg-[#F44336]/10 border border-[#F44336]/20 text-[#F44336] text-[12px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-[0_0_10px_rgba(244,67,54,0.1)]">
                <XCircle className="w-4 h-4" />
                Rejected
              </span>
            )}
          </div>
        </div>
      </div>


      <div className="max-w-6xl mx-auto p-6 space-y-8 mt-4">
        <AdminKycUserInfo kyc={kyc} status={status} />
        <AdminKycDocuments documents={kyc.documents} />
      </div>
      <KycActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={() => {
          approve.mutate();
          setIsModalOpen(false);
        }}
        onReject={(reason) => {
          reject.mutate(reason);
          setIsModalOpen(false);
        }}
        isLoading={approve.isPending || reject.isPending}
        fullName={kyc.fullName}
      />
    </div>

  );
};

export default ViewKycDocPage;
