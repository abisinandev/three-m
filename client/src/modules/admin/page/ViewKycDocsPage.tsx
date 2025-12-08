import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, User, Mail, Hash, MapPin, FileText } from "lucide-react";
import { FetchUserKycApi, approveKycApi, rejectKycApi } from "@shared/services/admin/user-management/KycApis";
import { toast } from "sonner";
import { useState } from "react";
import KycActionModal from "@shared/components/modals/KycActionModal";

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading KYC details...</div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-red-400 text-sm">Failed to load KYC details</div>
      </div>
    );
  }

  const kyc = data.data;
  const status = kyc.status.toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#0f0f0f] border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/kyc-management"
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold">KYC Review</h1>
              <p className="text-xs text-gray-400">
                {kyc.fullName} • {kyc.userCode || kyc.userId}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {status === "PENDING" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  Review & Approve/Reject
                </button>
              </div>
            )}

            {status === "VERIFIED" && (
              <span className="px-5 py-2 bg-emerald-600/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approved
              </span>
            )}

            {status === "REJECTED" && (
              <span className="px-5 py-2 bg-red-600/20 text-red-400 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Rejected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-5 space-y-8">

        {/* User Info Card */}
        <div className="bg-[#111] rounded-xl border border-neutral-800 p-6">
          <h2 className="text-base font-bold text-gray-300 mb-5 flex items-center gap-2">
            <User className="w-4 h-4" /> User Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-500 text-xs">Full Name</p>
                <p className="font-medium">{kyc.fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-500 text-xs">Email</p>
                <p className="font-medium">{kyc.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-500 text-xs">User Code</p>
                <p className="font-mono text-emerald-400">{kyc.userCode || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4" />
              <div>
                <p className="text-gray-500 text-xs">Status</p>
                <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${status === "VERIFIED" ? "bg-emerald-600/20 text-emerald-400" :
                  status === "REJECTED" ? "bg-red-600/20 text-red-400" :
                    "bg-yellow-600/20 text-yellow-400"
                  }`}>
                  {status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-500 text-xs">PAN</p>
                <p className="font-mono">{kyc.panNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-500 text-xs">Aadhaar (Last 4)</p>
                <p className="font-mono">XXXX-XXXX-{kyc.adhaarNumber}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 text-sm">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-gray-500 text-xs">Address</p>
              <p className="text-gray-300 leading-relaxed">
                {kyc.address.fullAddress}, {kyc.address.city}, {kyc.address.state} - {kyc.address.pinCode}
              </p>
            </div>
          </div>

          {kyc.rejectionReason && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Rejection Reason
              </p>
              <p className="text-red-300 text-xs mt-1">{kyc.rejectionReason}</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-300 mb-5 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Submitted Documents
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kyc.documents.map((doc: any) => (
              <div
                key={doc._id}
                className="bg-[#111] rounded-xl border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all duration-300 group"
              >
                <div className="bg-[#0f0f0f] px-5 py-4 border-b border-neutral-800">
                  <p className="text-sm font-semibold text-white capitalize tracking-wide">
                    {doc.type === 'pan' ? 'PAN Card' : doc.type === 'aadhaar' ? 'Aadhaar Card' : doc.type === 'selfie' ? 'Live Selfie' : doc.type}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1 font-medium">
                    {doc.fileName}
                  </p>
                </div>

                <div className="p-4 bg-black">
                  <div className="relative w-full h-64 bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
                    <img
                      src={doc.fileUrl}
                      alt={doc.type}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 pointer-events-none" />
                  </div>
                </div>

                <div className="px-5 py-3 bg-[#0f0f0f] border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-green-400 font-medium">Verified</span>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    View Full Size →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
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
        userName={kyc.fullName}
      />
    </div>

  );
};

export default ViewKycDocPage;