import { QUICK_ACTIONS } from '../constants/chatbot.constants';

interface QuickActionsProps {
    onAction: (prompt: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
    return (
        <div className="pl-9 pr-2 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            {QUICK_ACTIONS.map(action => (
                <button
                    key={action.id}
                    onClick={() => onAction(action.prompt)}
                    className="flex flex-col gap-2 p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-800 hover:border-neutral-700 transition-all text-left group"
                >
                    <div className="w-6 h-6 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center group-hover:bg-green-500/10 group-hover:border-green-500/20 group-hover:text-green-500 transition-colors">
                        <action.icon size={12} className="text-neutral-400 group-hover:text-green-500 transition-colors" />
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-400 group-hover:text-neutral-200 transition-colors">
                        {action.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
