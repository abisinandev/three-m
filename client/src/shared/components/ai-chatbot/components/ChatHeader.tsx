import { X, ShieldCheck } from 'lucide-react';

interface ChatHeaderProps {
    onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
    return (
        <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-800/50 bg-neutral-900/20">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-40" />
                </div>
                <div>
                    <h3 className="text-[12px] font-bold text-neutral-100 tracking-tight flex items-center gap-1.5 uppercase">
                        threeM Assistant
                        <ShieldCheck size={12} className="text-green-500/80" />
                    </h3>
                    <p className="text-[9px] text-neutral-500 font-medium uppercase tracking-[0.1em] mt-0.5">Secure AI Agent</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-all"
            >
                <X size={14} />
            </button>
        </div>
    );
}
