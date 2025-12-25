import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: any;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default' | 'success';
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
    destructive: "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/30",
    success: "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/30",
    default: "bg-[#22C55E] hover:bg-[#1ea853] shadow-lg shadow-green-900/30",
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#0d0d0d] rounded-2xl border border-[#282828] shadow-2xl w-full max-w-xs overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 transition z-10"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <div className="px-6 py-8 text-center">
          <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400 text-xs leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-300 bg-[#181818] border border-[#333] hover:bg-[#222] hover:border-[#444] transition disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all ${variantStyles[variant]} ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <>
                {/* {iconMap[variant]} */}
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;