import { useState } from "react";
import { Loader2, QrCode, X } from "lucide-react";

type TwoFAModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  loading?: boolean;
  qrCodeUrl?: string;
};

export const TwoFAModal = ({
  isOpen,
  onClose,
  onVerify,
  loading,
  qrCodeUrl,
}: TwoFAModalProps) => {
  const [code, setCode] = useState("");
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />

      <div className="relative w-full max-w-[340px] bg-[#0b0c0e] border border-[#1e2025] rounded-2xl shadow-2xl overflow-hidden">

        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#10b981]" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2025]">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#e8eaed]">Security Verification</span>
          </div>
          <button onClick={onClose} className="text-[#5a5f6e] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-[11px] text-[#5a5f6e] font-bold uppercase tracking-wider leading-relaxed">
              Enter the 6-digit code from your authenticator app to proceed.
            </p>
          </div>

          {/* QR Code Toggle */}
          {qrCodeUrl && (
            <div className="text-center">
              <button
                onClick={() => setShowQr((prev) => !prev)}
                className="inline-flex items-center gap-2 text-[10px] font-bold text-[#2962ff] hover:text-[#3d72ff] transition uppercase tracking-widest"
              >
                <QrCode size={14} />
                {showQr ? "Hide QR Code" : "Scan QR Code"}
              </button>
            </div>
          )}

          {/* QR Code Section */}
          {showQr && qrCodeUrl && (
            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-200">
              <div className="p-3 bg-white rounded-xl shadow-lg">
                <img
                  src={qrCodeUrl}
                  alt="2FA QR Code"
                  className="w-32 h-32"
                />
              </div>
              <p className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-widest text-center">
                Scan this with Google Authenticator
              </p>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              className="w-full bg-[#111214] border border-[#1e2025] rounded-xl py-3 px-4 text-[18px] text-white outline-none focus:border-[#2962ff]/50 transition-all font-black text-center tracking-[0.5em] placeholder:text-[#222]"
              maxLength={6}
            />
            <label className="block text-[9px] text-[#5a5f6e] font-bold uppercase tracking-[0.2em] mt-2.5 text-center">
              Verification Code
            </label>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => onVerify(code)}
              disabled={!code || code.length < 6 || loading}
              className="w-full py-3.5 bg-[#2962ff] hover:bg-[#3d72ff] disabled:opacity-30 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Verify & Authorize"}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-[10px] font-bold text-[#5a5f6e] hover:text-white transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
