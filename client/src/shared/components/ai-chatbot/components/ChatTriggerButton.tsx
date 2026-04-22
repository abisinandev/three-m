import { Sparkles } from 'lucide-react';

interface ChatTriggerButtonProps {
    onClick: () => void;
}

export function ChatTriggerButton({ onClick }: ChatTriggerButtonProps) {
    return (
        <div className="fixed bottom-8 right-8 z-[100] group">
            <div className="absolute inset-0 bg-green-500 opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity duration-500" />

            <button
                onClick={onClick}
                className="
                    relative h-12 bg-neutral-900/90 backdrop-blur-md border border-green-500/20
                    rounded-full flex items-center overflow-hidden
                    transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    hover:border-green-500/50 hover:bg-neutral-800
                    active:scale-[0.96] shadow-2xl shadow-green-900/20
                "
            >
                <div className="overflow-hidden max-w-0 group-hover:max-w-[140px] transition-all duration-500 ease-in-out">
                    <span className="
                        pl-5 pr-2 text-[11px] font-bold text-neutral-200 tracking-wide whitespace-nowrap
                        opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
                        transition-all duration-500 delay-100 uppercase
                    ">
                        threeM AI
                    </span>
                </div>

                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles size={18} className="text-green-500 relative z-10 animate-pulse-slow" />
                </div>
            </button>
        </div>
    );
}
