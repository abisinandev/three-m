import { CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface KycActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: (reason: string) => void;
    isLoading?: boolean;
    fullName: string;
}

export default function KycActionModal({
    isOpen,
    onClose,
    onApprove,
    onReject,
    isLoading = false,
    fullName,
}: KycActionModalProps) {
    const [activeTab, setActiveTab] = useState<"approve" | "reject">("approve");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleReject = () => {
        if (reason.trim().length < 10) {
            setError("Please provide a valid reason (min 10 characters)");
            return;
        }
        onReject(reason.trim());
        setReason("");
        setError("");
    };

    const handleClose = () => {
        if (!isLoading) {
            setReason("");
            setError("");
            setActiveTab("approve");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/80"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-[360px] bg-[#0b0c0e] border border-[#1e2025] rounded-2xl shadow-2xl overflow-hidden">
                {/* Tab Switcher */}
                <div className="flex border-b border-[#1e2025]">
                    <button
                        onClick={() => setActiveTab("approve")}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "approve"
                            ? "bg-[#00C853]/5 text-[#00C853] border-b-2 border-[#00C853]"
                            : "text-[#5a5f6e] hover:text-white"
                            }`}
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => setActiveTab("reject")}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "reject"
                            ? "bg-red-500/5 text-red-500 border-b-2 border-red-500"
                            : "text-[#5a5f6e] hover:text-white"
                            }`}
                    >
                        Reject
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === "approve" ? (
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#00C853]/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-[#00C853]/20">
                                <CheckCircle size={24} className="text-[#00C853]" />
                            </div>
                            <h3 className="text-[14px] font-black text-white uppercase tracking-tight mb-2">Approve Verification</h3>
                            <p className="text-[11px] text-[#5a5f6e] leading-relaxed font-bold uppercase tracking-tight">
                                This will verify <span className="text-white">{fullName}</span> and grant full platform access.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle size={18} className="text-red-500" />
                                <h3 className="text-[14px] font-black text-white uppercase tracking-tight">Reject Submission</h3>
                            </div>
                            <textarea
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setError("");
                                }}
                                placeholder="Reason for rejection (e.g. Blurry image, Name mismatch)"
                                className="w-full h-28 px-4 py-3 bg-[#111214] border border-[#1e2025] rounded-xl text-white placeholder-[#222] focus:border-red-500/50 focus:outline-none resize-none text-[12px] font-bold"
                            />
                            {error && <p className="text-red-500 text-[9px] font-bold uppercase tracking-tight">{error}</p>}
                            <p className="text-right text-[9px] text-[#3a3d45] font-black uppercase tracking-widest">
                                {reason.length}/300
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 py-3.5 bg-[#111214] hover:bg-[#1a1b1e] text-[#5a5f6e] hover:text-[#e8eaed] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-[#1e2025] disabled:opacity-30"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={activeTab === "approve" ? onApprove : handleReject}
                        disabled={isLoading || (activeTab === "reject" && reason.trim().length < 10)}
                        className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === "approve"
                            ? "bg-[#00C853] hover:bg-[#00E676] text-black shadow-lg shadow-green-500/10"
                            : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/10"
                            } disabled:opacity-30`}
                    >
                        {isLoading ? (
                            <>Processing...</>
                        ) : activeTab === "approve" ? (
                            <>Confirm Approve</>
                        ) : (
                            <>Confirm Reject</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}