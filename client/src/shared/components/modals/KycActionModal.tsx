// components/KycActionModal.tsx
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#0f0f0f] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Tab Switcher */}
                <div className="flex border-b border-neutral-800">
                    <button
                        onClick={() => setActiveTab("approve")}
                        className={`flex-1 py-4 text-sm font-semibold transition-all ${activeTab === "approve"
                                ? "bg-emerald-600/20 text-emerald-400 border-b-2 border-emerald-500"
                                : "text-gray-400 hover:text-white"
                            }`}
                    >
                        <CheckCircle className="w-5 h-5 inline-block mr-2" />
                        Approve
                    </button>
                    <button
                        onClick={() => setActiveTab("reject")}
                        className={`flex-1 py-4 text-sm font-semibold transition-all ${activeTab === "reject"
                                ? "bg-red-600/20 text-red-400 border-b-2 border-red-500"
                                : "text-gray-400 hover:text-white"
                            }`}
                    >
                        <XCircle className="w-5 h-5 inline-block mr-2" />
                        Reject
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === "approve" ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Approve KYC?</h3>
                            <p className="text-gray-400 mt-2 text-sm">
                                This will verify <span className="text-emerald-400 font-medium">{fullName}</span>
                                <br />
                                and grant full access to the platform.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-3 text-red-400 mb-4">
                                <AlertCircle className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Reject KYC</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">
                                Please explain why this KYC is being rejected. The user will see this message.
                            </p>
                            <textarea
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setError("");
                                }}
                                placeholder="e.g. Image is blurry • Name doesn't match • Document expired"
                                className="w-full h-32 px-4 py-3 bg-[#111] border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none resize-none text-sm"
                            />
                            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                            <p className="text-right text-xs text-gray-500 mt-1">
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
                        className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={activeTab === "approve" ? onApprove : handleReject}
                        disabled={isLoading || (activeTab === "reject" && reason.trim().length < 10)}
                        className={`flex-1 py-3 font-bold rounded-lg transition flex items-center justify-center gap-2 ${activeTab === "approve"
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                : "bg-red-600 hover:bg-red-500 text-white"
                            } disabled:opacity-60`}
                    >
                        {isLoading ? (
                            <>Processing...</>
                        ) : activeTab === "approve" ? (
                            <>Approve KYC</>
                        ) : (
                            <>Reject KYC</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}