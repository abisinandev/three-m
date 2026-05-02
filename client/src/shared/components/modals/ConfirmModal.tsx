import { AlertCircle, CheckCircle2, Info, Loader2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default' | 'success' | 'warning';
  loading?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  loading = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const variantStyles = {
    destructive: "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/10 text-white",
    success: "bg-[#00C853] hover:bg-[#00E676] shadow-lg shadow-green-500/10 text-black",
    warning: "bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-500/10 text-white",
    default: "bg-[#2962ff] hover:bg-[#3d72ff] shadow-lg shadow-blue-500/10 text-white",
  };

  const statusColor = {
    destructive: "bg-red-500",
    success: "bg-[#00C853]",
    warning: "bg-amber-500",
    default: "bg-[#2962ff]",
  };

  const iconMap = {
    destructive: <AlertCircle size={20} className="text-red-500" />,
    success: <CheckCircle2 size={20} className="text-[#00C853]" />,
    warning: <AlertCircle size={20} className="text-amber-500" />,
    default: <Info size={20} className="text-blue-500" />,
  };


  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />

      <div className="relative w-full max-w-[340px] bg-[#0b0c0e] border border-[#1e2025] rounded-2xl overflow-hidden shadow-2xl">
        {/* Top Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] ${statusColor[variant]}`} />

        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2025]">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-black text-[#e8eaed] uppercase tracking-widest">{title}</span>
          </div>
          <button onClick={onClose} disabled={loading} className="text-[#5a5f6e] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5 border border-[#1e2025]">
            {iconMap[variant]}
          </div>
          <div className="text-[11px] text-[#5a5f6e] font-bold uppercase tracking-wider leading-relaxed px-2">
            {message}
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#5a5f6e] bg-[#111214] border border-[#1e2025] hover:bg-[#1a1b1e] hover:text-[#e8eaed] transition-all disabled:opacity-30"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${variantStyles[variant]} ${loading ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;